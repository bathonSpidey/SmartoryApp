// ─────────────────────────────────────────────
//  InventorySummary — thin orchestrator
//  Fetches exchange rates + user's preferred
//  currency, then threads both into children.
// ─────────────────────────────────────────────

import { SemanticTheme, Spacing } from "@/constants/Themes";
import { useUserCurrency } from "@/hooks/useUserCurrency";
import { ExchangeRates, getExchangeRates } from "@/lib/currency.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SpendBreakdown } from "./summary/SpendBreakdown";
import { SpendHero } from "./summary/SpendHero";
import { Receipt } from "./types";

type Props = { receipts: Receipt[]; theme: SemanticTheme };

export function InventorySummary({ receipts, theme }: Props) {
  const { currency } = useUserCurrency();
  const [rates, setRates] = useState<ExchangeRates>({});

  useEffect(() => {
    getExchangeRates()
      .then(setRates)
      .catch(() => {});
  }, []);

  return (
    <View style={s.container}>
      <SpendHero
        receipts={receipts}
        theme={theme}
        preferredCurrency={currency}
        rates={rates}
      />
      <SpendBreakdown
        receipts={receipts}
        theme={theme}
        preferredCurrency={currency}
        rates={rates}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { gap: Spacing.sm, marginBottom: Spacing.md },
});
