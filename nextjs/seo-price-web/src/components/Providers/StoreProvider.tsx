import { CategoriesStoreProvider } from "@/store/categories";
import { CoinDetailStoreProvider } from "@/store/coinDetail";
import { CurrencyStoreProvider } from "@/store/currency";
import { MarketStoreProvider } from "@/store/market";
import { PriceStoreProvider } from "@/store/price";
import { UserAssetsStoreProvider } from "@/store/userAssets";

export default function StoreProvider({ children }) {
  return (
    <CategoriesStoreProvider>
      <MarketStoreProvider>
        <CurrencyStoreProvider>
          <PriceStoreProvider>
            <UserAssetsStoreProvider>
              <CoinDetailStoreProvider>
                {children}
              </CoinDetailStoreProvider>
            </UserAssetsStoreProvider>
          </PriceStoreProvider>
        </CurrencyStoreProvider>
      </MarketStoreProvider>
    </CategoriesStoreProvider>
  );
}
