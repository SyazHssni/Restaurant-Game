# Reference helper snippets for Rush Bite playwright tests (inlined into browser_automation scripts)
PAY_JS = """() => {
  const rm = (t) => Math.round(parseFloat(t.replace(/[^0-9.]/g,'')) * 100);
  let tot = 0;
  document.querySelectorAll('[data-testid^="receipt-line-"]').forEach(e => {
    const m = e.textContent.match(/RM([0-9.]+)\\s*×\\s*(\\d+)/); if (m) tot += Math.round(parseFloat(m[1])*100) * parseInt(m[2]);
  });
  const d = document.querySelector('[data-testid="receipt-discount"]');
  if (d) { const ms = d.textContent.match(/RM([0-9.]+)/g); tot -= rm(ms[ms.length-1]); }
  const tender = rm(document.querySelector('[data-testid="receipt-tender"]').textContent);
  return {total: tot, tender};
}"""
