from playwright.sync_api import sync_playwright, expect
import re

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Verify Homepage Header (Desktop)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto("http://localhost:3000")
        page.wait_for_load_state("networkidle")

        # Screenshot of the hero section with liquid glass effect
        page.screenshot(path="verification/homepage_glass.png", full_page=False)
        print("Captured homepage_glass.png")

        browser.close()

if __name__ == "__main__":
    run()
