import { OPERATING_COST } from "./config";
import { shiftNet, mathScore } from "./engine";

export function buildSummary(s) {
  const l = s.ledger;
  const net = shiftNet(l);
  const st = s.stats;
  return {
    day: s.day, mode: s.mode, ledger: l, net, operating: OPERATING_COST, fundsBefore: s.startFunds,
    fundsAfter: s.startFunds + net - OPERATING_COST, target: s.cfg.target, met: net >= s.cfg.target,
    repBefore: s.startRep, repAfter: s.reputation, mathScore: mathScore(st),
    bill: { correct: st.billOrders, firstTry: st.billFirstTry, wrong: st.billWrong },
    change: { correct: st.changeCorrect, total: st.changeTotal },
    bestStreak: st.bestStreak, hints: st.hints, served: st.served, left: st.left,
    avgStars: st.served ? (st.starsSum / st.served).toFixed(1) : "—",
    foodAcc: st.served ? Math.round(st.foodAccSum / st.served) : null,
    workedExample: s.workedExample,
  };
}
