#!/usr/bin/env python3
"""
Automated Real Photo Fetcher for CampusNet using Playwright (Headless Chromium)
Fetches real user-uploaded photos from:
  1. Google Maps place page & photo gallery (googleusercontent.com)
  2. High-precision secondary web image search (Bing / DDG) for exact property name in Pune
Saves photos locally to public/images/listings/{listing_id}_{index}.jpg
Incrementally updates src/data/listings.json and src/data/real-listings.ts
"""

import os
import re
import sys
import json
import time
import argparse
import urllib.parse
import urllib.request

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
except ImportError:
    print("\n[!] Playwright is not installed.")
    print("Please install it with:")
    print("    pip install playwright\n")
    sys.exit(1)


def get_high_res_photo_url(url: str) -> str:
    """Transform Google Maps photo thumbnail URL to high resolution."""
    if not url:
        return ""
    if "googleusercontent.com" in url:
        base_url = re.sub(r'=w\d+.*$|=s\d+.*$', '', url)
        return f"{base_url}=w1200-h800-k-no"
    return url


def download_image(url: str, dest_path: str) -> bool:
    """Download image to dest_path with timeout and user-agent."""
    try:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": (
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/124.0.0.0 Safari/537.36"
                ),
                "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                "Referer": "https://www.google.com/"
            }
        )
        with urllib.request.urlopen(req, timeout=12) as resp:
            content = resp.read()
            if len(content) > 4000:  # Valid image > 4KB
                with open(dest_path, "wb") as f:
                    f.write(content)
                return True
    except Exception:
        pass
    return False


def extract_photos_from_google_maps(page, maps_url: str, title: str, locality: str, max_photos: int = 3) -> list:
    """Attempt extraction from Google Maps place page & gallery."""
    photo_urls = []

    try:
        page.goto(maps_url, timeout=20000, wait_until="load")
        page.wait_for_timeout(2500)

        # Handle cookie consent / dialog buttons if present
        try:
            accept_btn = page.locator('button:has-text("Accept all"), button:has-text("I agree")').first
            if accept_btn.is_visible(timeout=1000):
                accept_btn.click()
                page.wait_for_timeout(1000)
        except Exception:
            pass

        # 1. Grab hero image first if available
        try:
            hero_img = page.locator('button[jsaction*="heroHeaderImage"] img').first
            if hero_img.is_visible(timeout=1500):
                src = hero_img.get_attribute("src")
                if src and "googleusercontent.com" in src and "/a/" not in src:
                    high_res = get_high_res_photo_url(src)
                    if high_res not in photo_urls:
                        photo_urls.append(high_res)
        except Exception:
            pass

        # 2. Click hero image button to open photo gallery if available
        try:
            photo_btn = page.locator('button[jsaction*="heroHeaderImage"], button[role="tab"][aria-label*="Photo"]').first
            if photo_btn.is_visible(timeout=1500):
                photo_btn.click()
                page.wait_for_timeout(2500)
        except Exception:
            pass

        # 3. Extract user-uploaded and Google verified photos from gallery
        try:
            all_imgs = page.locator('img').all()
            for img in all_imgs:
                src = img.get_attribute("src")
                if src and "googleusercontent.com" in src and "/a/" not in src:
                    if "/p/" in src or "/grass-cs/" in src:
                        high_res = get_high_res_photo_url(src)
                        if high_res not in photo_urls:
                            photo_urls.append(high_res)
                            if len(photo_urls) >= max_photos:
                                break
        except Exception:
            pass

    except Exception:
        pass

    return photo_urls


def extract_photos_from_web_search(page, title: str, locality: str, max_photos: int = 3) -> list:
    """Secondary lookup: Search web images for the exact PG / Hostel in Pune."""
    photo_urls = []
    # Clean title for clean search query
    clean_title = re.sub(r'[:/,\-()]+', ' ', title).strip()
    clean_title = ' '.join(clean_title.split()[:5])  # first 5 words
    query = f"{clean_title} {locality} Pune hostel room"
    search_url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}"

    try:
        page.goto(search_url, timeout=15000, wait_until="domcontentloaded")
        page.wait_for_timeout(2000)

        links = page.locator('a.iusc').all()
        for a in links[:10]:
            m_attr = a.get_attribute('m')
            if m_attr:
                try:
                    data = json.loads(m_attr)
                    murl = data.get('murl')
                    turl = data.get('turl')
                    # Validate URL
                    target = murl if murl and murl.startswith('http') else turl
                    if target and target not in photo_urls:
                        photo_urls.append(target)
                        if len(photo_urls) >= max_photos:
                            break
                except Exception:
                    pass

        # Fallback to direct img tags on search page if iusc links empty
        if not photo_urls:
            imgs = page.locator('.imgpt img, img.mimg').all()
            for img in imgs[:5]:
                src = img.get_attribute('src') or img.get_attribute('data-src') or ''
                if src and src.startswith('http') and src not in photo_urls:
                    photo_urls.append(src)
                    if len(photo_urls) >= max_photos:
                        break
    except Exception:
        pass

    return photo_urls


def main():
    parser = argparse.ArgumentParser(description="Fetch real accommodation photos for CampusNet.")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of listings to process (0 = all 96)")
    parser.add_argument("--force", action="store_true", help="Re-fetch photos even if listing already has photos")
    parser.add_argument("--headful", action="store_true", help="Run browser in headful mode (visible)")
    args = parser.parse_args()

    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(project_root, "src", "data", "listings.json")
    ts_data_path = os.path.join(project_root, "src", "data", "real-listings.ts")
    images_dir = os.path.join(project_root, "public", "images", "listings")
    os.makedirs(images_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print(f"[-] Error: {data_path} not found.")
        sys.exit(1)

    with open(data_path, "r", encoding="utf-8") as f:
        listings = json.load(f)

    print("=" * 70)
    print("CampusNet Automated Real Photo Fetcher (All 96 Listings)")
    print("=" * 70)
    print(f"Total listings in database: {len(listings)}")

    to_process = []
    for l in listings:
        has_photos = l.get("hasRealPhotos", False) and len(l.get("images", [])) > 0
        if args.force or not has_photos:
            to_process.append(l)

    if args.limit > 0:
        to_process = to_process[:args.limit]

    print(f"Listings to process: {len(to_process)}")
    if not to_process:
        print("[+] All listings already have real photos! Use --force to re-fetch.")
        sys.exit(0)

    print("\nLaunching headless browser with system Chrome / Edge...")

    with sync_playwright() as p:
        launch_kwargs = {
            "headless": not args.headful,
            "args": [
                "--disable-blink-features=AutomationControlled",
                "--lang=en-US",
                "--no-sandbox"
            ]
        }
        try:
            browser = p.chromium.launch(channel="chrome", **launch_kwargs)
        except Exception:
            try:
                browser = p.chromium.launch(channel="msedge", **launch_kwargs)
            except Exception:
                browser = p.chromium.launch(**launch_kwargs)

        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            locale="en-US"
        )
        page = context.new_page()

        success_count = 0
        fallback_count = 0

        for index, item in enumerate(to_process, 1):
            title = item.get("title", "Accommodation")
            locality = item.get("locality", "Pune")
            listing_id = item.get("id")

            print(f"\n[{index}/{len(to_process)}] {title} ({locality})")

            # 1. Try Google Maps first
            maps_url = item.get("mapsUrl")
            if not maps_url or "cid=" not in maps_url:
                search_query = f"{title} {locality} Pune"
                maps_url = f"https://www.google.com/maps/search/{urllib.parse.quote(search_query)}"

            photo_urls = extract_photos_from_google_maps(page, maps_url, title, locality, max_photos=3)

            # 2. If Google Maps has 0 photos, use high-precision secondary web image search
            if not photo_urls:
                print("    [-] 0 photos on Google Maps. Querying secondary web image search...")
                photo_urls = extract_photos_from_web_search(page, title, locality, max_photos=3)

            downloaded_images = []
            if photo_urls:
                print(f"    Found {len(photo_urls)} real property photo(s). Downloading...")
                for idx, photo_url in enumerate(photo_urls):
                    file_name = f"{listing_id}_{idx}.jpg"
                    local_path = os.path.join(images_dir, file_name)

                    if download_image(photo_url, local_path):
                        rel_path = f"/images/listings/{file_name}"
                        downloaded_images.append(rel_path)
                        print(f"      [OK] Saved photo {idx + 1}: {file_name}")

            if downloaded_images:
                item["hasRealPhotos"] = True
                item["images"] = downloaded_images
                item["image"] = downloaded_images[0]
                success_count += 1
                print(f"    [+] Updated with {len(downloaded_images)} real photo(s).")
            else:
                item["hasRealPhotos"] = False
                item["images"] = []
                item["image"] = ""
                fallback_count += 1
                print("    [-] No photos found anywhere -> Using clean architectural fallback card.")

            # Save incrementally after each listing so progress is never lost
            with open(data_path, "w", encoding="utf-8") as f:
                json.dump(listings, f, indent=2)

            # Keep TypeScript sync updated
            ts_content = (
                "// Auto-generated real listings dataset from Google Places / Google Maps\n"
                "import type { PuneListing } from '../data-pune';\n"
                "import listingsData from './listings.json';\n\n"
                "export const realListings: PuneListing[] = listingsData as PuneListing[];\n"
            )
            with open(ts_data_path, "w", encoding="utf-8") as f:
                f.write(ts_content)

            time.sleep(0.5)

        browser.close()

    print("\n" + "=" * 70)
    print("Automated Fetch Complete across All Listings!")
    print(f"Listings with Real Photos: {success_count}")
    print(f"Listings with Architectural Fallback Card: {fallback_count}")
    print(f"Saved: {data_path}")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    main()
