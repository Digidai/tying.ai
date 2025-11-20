from playwright.sync_api import sync_playwright, expect
import re

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Verify Homepage Header (Desktop)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto("http://localhost:3000")
        page.wait_for_load_state("networkidle")

        # Screenshot of the hero section
        page.screenshot(path="verification/homepage_desktop.png", full_page=False)
        print("Captured homepage_desktop.png")

        # 2. Verify Mobile Menu (Mobile)
        page_mobile = browser.new_page(viewport={'width': 375, 'height': 667})
        page_mobile.goto("http://localhost:3000")
        page_mobile.wait_for_load_state("networkidle")

        # Check if mobile menu button exists
        menu_button = page_mobile.locator("#mobile-menu-button")
        expect(menu_button).to_be_visible()

        # Click menu button and verify menu opens
        menu_button.click()
        mobile_menu = page_mobile.locator("#mobile-menu")

        # Wait for class change. Using regex to ensure 'hidden' is NOT present.
        # expect(mobile_menu).not_to_have_class(re.compile(r"hidden"))
        # Actually, easier to just check if it is visible if hidden class hides it.
        # Tailwind 'hidden' applies display: none.
        expect(mobile_menu).to_be_visible()

        page_mobile.screenshot(path="verification/mobile_menu_open.png")
        print("Captured mobile_menu_open.png")

        # 3. Verify Breadcrumbs (Mobile)
        page_wiki = browser.new_page(viewport={'width': 375, 'height': 667})
        page_wiki.goto("http://localhost:3000/wiki/software-engineer")
        page_wiki.wait_for_load_state("networkidle")

        # Locate breadcrumbs
        breadcrumbs = page_wiki.locator("nav.overflow-x-auto")
        expect(breadcrumbs).to_be_visible()

        page_wiki.screenshot(path="verification/wiki_breadcrumbs_mobile.png")
        print("Captured wiki_breadcrumbs_mobile.png")

        browser.close()

if __name__ == "__main__":
    run()
