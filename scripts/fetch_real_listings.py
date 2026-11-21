#!/usr/bin/env python3
"""
Automated Real Photo Fetcher for CampusNet using Playwright (Headless Chromium)
Fetches real user-uploaded photos from Google Maps without API keys or billing.
Saves photos to public/images/listings/{listing_id}_{index}.jpg
Updates src/data/listings.json and src/data/real-listings.ts
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
    print("    pip install playwright")
    print("    playwright install chromium\n")
    sys.exit(1)


def get_high_res_photo_url(url: str) -> str:
    """Transform Google Maps photo thumbnail URL to high resolution."""
    if not url:
        return ""
    # Strip existing dimension parameters (=w...-h... or =s...)
    base_url = re.sub(r'=w\d+.*$|=s\d+.*$', '', url)
    return f"{base_url}=w1200-h800-k-no"


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
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            if len(content) > 5000:  # Valid image > 5KB
                with open(dest_path, "wb") as f:
                    f.write(content)
                return True
    except Exception as e:
        pass
    return False


def extract_photos_from_page(page, max_photos: int = 3) -> list:
    """Extract real property photo URLs from Google Maps place page."""
    photo_urls = []

    try:
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

        # 2. Click hero image or photo tab to open photo gallery
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
                    # Valid if it has /p/ or /grass-cs/ or high-res marker
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


def main():
    parser = argparse.ArgumentParser(description="Fetch real Google Maps photos using Playwright.")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of listings to process (0 = all)")
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

    print("=" * 65)
    print("CampusNet Real Photo Fetcher (Playwright Headless)")
    print("=" * 65)
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
        print("[+] All listings already have real photos downloaded! Use --force to re-fetch.")
        sys.exit(0)

    print("\nStarting Playwright Chromium browser...")

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

            # Construct best target URL
            maps_url = item.get("mapsUrl")
            if not maps_url or "cid=" not in maps_url:
                search_query = f"{title} {locality} Pune"
                maps_url = f"https://www.google.com/maps/search/{urllib.parse.quote(search_query)}"

            print(f"\n[{index}/{len(to_process)}] {title} ({locality})")
            print(f"    Navigating: {maps_url[:80]}...")

            downloaded_images = []
            try:
                page.goto(maps_url, timeout=30000, wait_until="domcontentloaded")
                photo_urls = extract_photos_from_page(page, max_photos=3)

                if photo_urls:
                    print(f"    Found {len(photo_urls)} real Google photo(s). Downloading...")
                    for idx, photo_url in enumerate(photo_urls):
                        file_name = f"{listing_id}_{idx}.jpg"
                        local_path = os.path.join(images_dir, file_name)

                        if download_image(photo_url, local_path):
                            rel_path = f"/images/listings/{file_name}"
                            downloaded_images.append(rel_path)
                            print(f"      [OK] Saved photo {idx + 1}: {file_name}")

            except PlaywrightTimeoutError:
                print("    [!] Navigation timed out.")
            except Exception as e:
                print(f"    [!] Error: {e}")

            if downloaded_images:
                item["hasRealPhotos"] = True
                item["images"] = downloaded_images
                item["image"] = downloaded_images[0]
                success_count += 1
                print(f"    [+] Listing updated with {len(downloaded_images)} real photo(s).")
            else:
                item["hasRealPhotos"] = False
                item["images"] = []
                item["image"] = ""
                fallback_count += 1
                print("    [-] Zero photos uploaded on Google Maps -> Using clean dark fallback card.")

            # Save incrementally after each listing so progress is never lost
            with open(data_path, "w", encoding="utf-8") as f:
                json.dump(listings, f, indent=2)

            # Brief pause between listings
            time.sleep(1.0)

        browser.close()

    # Update real-listings.ts as well
    ts_content = (
        "// Auto-generated real listings dataset from Google Places / Google Maps\n"
        "import type { PuneListing } from '../data-pune';\n"
        "import listingsData from './listings.json';\n\n"
        "export const realListings: PuneListing[] = listingsData as PuneListing[];\n"
    )
    with open(ts_data_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print("\n" + "=" * 65)
    print("Scrape & Download Complete!")
    print(f"Listings with Real Photos: {success_count}")
    print(f"Listings with Clean Fallback Card: {fallback_count}")
    print(f"Updated: {data_path}")
    print("=" * 65 + "\n")


if __name__ == "__main__":
    main()
