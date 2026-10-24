# Rush Bite playwright helper snippets (inline into browser_automation scripts)
SAVE_DAY5 = """()=>localStorage.setItem('rushbite_save_v1', JSON.stringify({"day":5,"funds":30000,"reputation":50,"insolventShifts":0,"bankrupt":false,"tutorialDone":true,"bestStreak":0,"history":[{}]}))"""

# Async pay(page): compute bill from receipt, type it, give greedy change.
PAY_SNIPPET = '''
async def pay(page):
    info = await page.evaluate("""() => {
      let tot = 0;
      document.querySelectorAll('[data-testid^="receipt-line-"]').forEach(e => {
        const m = e.textContent.match(/RM([0-9.]+)\\\\s*×\\\\s*(\\\\d+)/); if (m) tot += Math.round(parseFloat(m[1])*100) * parseInt(m[2]);
      });
      const d = document.querySelector('[data-testid="receipt-discount"]');
      if (d) { const ms = d.textContent.match(/RM([0-9.]+)/g); tot -= Math.round(parseFloat(ms[ms.length-1].slice(2))*100); }
      const tender = Math.round(parseFloat(document.querySelector('[data-testid="receipt-tender"]').textContent.replace(/[^0-9.]/g,''))*100);
      return {total: tot, tender};
    }""")
    s = f"{info['total']//100}.{info['total']%100:02d}"
    for ch in s:
        await page.keyboard.press(ch)
    await page.keyboard.press("Enter")
    await page.wait_for_timeout(400)
    change = info['tender'] - info['total']
    if change == 0:
        await page.click('[data-testid="exact-payment-confirm-button"]')
    else:
        left = change
        for d in [10000,5000,2000,1000,500,100,50,20,10]:
            while left >= d:
                b = page.locator(f'[data-testid="denom-{d}"]')
                if not await b.is_enabled(): break
                await b.click(); left -= d
        await page.click('[data-testid="give-change-button"]')
    await page.wait_for_timeout(300)
    return info, change
'''
