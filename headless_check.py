from playwright.sync_api import sync_playwright

URL = "http://localhost:8000/"

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    console_msgs = []
    def on_console(msg):
        console_msgs.append(f"{msg.type}: {msg.text}")
    page.on("console", on_console)

    # Load home
    page.goto(URL)
    page.wait_for_load_state("networkidle")

    deck_count = page.locator('#decksList > li').count()
    # If display:contents removed li from inside ul, check children
    if deck_count == 0:
        deck_count = page.eval_on_selector_all('#decksList', 'els => els.flatMap(e => Array.from(e.children)).length')

    # Try navigate to first gallery item if exists
    first_hash = None
    if deck_count and deck_count != 0:
        # find first link inside list
        href = page.eval_on_selector('#decksList', 'el => { const a = el.querySelector("a.card__link"); return a ? a.getAttribute("href") : null }')
        first_hash = href
    
    card_list_count = None
    if first_hash:
        page.goto(URL + first_hash)
        page.wait_for_load_state("networkidle")
        card_list_count = page.locator('#cardsList > li').count()
        if card_list_count == 0:
            card_list_count = page.eval_on_selector_all('#cardsList', 'els => els.flatMap(e => Array.from(e.children)).length')

    out = {
        'console': console_msgs,
        'deck_count': deck_count,
        'first_hash': first_hash,
        'card_list_count': card_list_count,
    }
    print(out)
    browser.close()
