import type { IMockMethod } from '@kc/mk-plugin-mock';

export default [
  {
    url: '/_api/gem-staking-front/gempool/staking/campaign',
    disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": [
          {
            "campaignId": "68232d2d5f3ce000013a2af6",
            "campaignName": "NXPC GemPool",
            "earnTokenName": "NXPC",
            "earnTokenLogo": "https://assets-currency.kucoin.com/68232ac7c6ca2500012b8560_logo.png",
            "earnTokenOverview": "NXPC 是 MapleStory Universe 生態的基礎代幣，旨在捕捉及體現遊戲內活動和整體生態增長的價值。它具備多重功能：作為 Layer 1 網絡的交易手續費代幣、用於購買 NFT 物品組合的交換媒介，以及 NESO（與 NXPC 錨定的遊戲貨幣）的儲備資產。玩家可將 NXPC 轉換成 NESO 以進行物品升級，而創作者則透過創造價值獲得 NXPC 獎勵，並遵循透明且基於減半機制的發放模式。NXPC 的需求來自短期和長期用途：短期內，它推動遊戲玩法，透過 NXPC 創造稀有物品，使用 NESO 強化物品，而相關的網絡活動亦會消耗 NXPC 作為網絡費用。在最新的公開測試中，流通中的 76% NXPC 已實際用於遊戲，展現出真實的用戶需求。長期而言，NXPC 將成為創作者經濟的重要基石，協助第三方開發者透過生態 SDK 開發新應用，獲得 NXPC 獎勵，並吸引傳統遊戲圈以外的新用戶。隨著更多新應用擴大 NFT 和 NESO 的使用場景，也進一步鞏固了 NXPC 作為 MapleStory Universe 核心價值橋樑的地位。",
            "totalReturns": "1000000.00000000000000000000",
            "stakingStartTime": 1747144800000,
            "stakingEndTime": 1747749600000,
            "displayStartTime": 1747144800000,
            "displayEndTime": 1747144800000,
            "openBonusTask": 1,
            "userBonusCoefficient": "0",
            "pools": [
              {
                "poolId": "68232da75f3ce000013a2af8",
                "stakingToken": "KCS",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/60c74375db892b0006d819a9_KCS.png",
                "earnTokenAmount": "800000",
                "totalStakingAmount": "2639149.29479867",
                "totalStakingParticipants": 4734,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "stakingStartTime": 1747144800000,
                "stakingEndTime": 1747749600000,
                "myStakingInfo": null,
                "maximumDailyRewards": null,
                "tokenScale": 8,
                "minStakingAmount": "3",
                "specificType": 0,
                "specificTag": null,
                "annualPercentageRate": 1.234507,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users"
              },
              {
                "poolId": "68232e055f3ce000013a2af9",
                "stakingToken": "USDT",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                "earnTokenAmount": "200000",
                "totalStakingAmount": "36502757.37988009",
                "totalStakingParticipants": 4031,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "stakingStartTime": 1747144800000,
                "stakingEndTime": 1747749600000,
                "myStakingInfo": null,
                "maximumDailyRewards": null,
                "tokenScale": 8,
                "minStakingAmount": "10",
                "specificType": 1,
                "specificTag": null,
                "annualPercentageRate": 0.00003,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users"
              }
            ],
            "userBonusTaskFinish": 0,
            "earnDistributeTime": null,
            "mediaInfo": "[{\"value\":\"https://msu.io/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/MaplestoryU\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://docs.nexpace.io/\",\"mediaName\":\"Whitepaper\"}]",
            "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users"
          }
        ]
      }
    },
  },
  {
    url: '/_api/gem-staking-front/gempool/staking/campaign/history',
    disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "currentPage": 1,
        "pageSize": 5,
        "totalNum": 49,
        "totalPage": 10,
        "items": [
          {
            "campaignId": "681c194b4dc05a0001ac11a9",
            "campaignName": "SHM GemPool",
            "earnTokenName": "SHM",
            "earnTokenLogo": "https://assets-currency.kucoin.plus/681b0537388de70001756ed4_logo%20%2810%29.png",
            "earnTokenOverview": "Shardeum 是基於 EVM 架構的 Layer-1 區塊鏈，具備自動擴展功能。其動態狀態分片設計可在用戶參與度提升的同時維持低網絡費用與高 TPS。Shardeum 採用交易級別的共識機制，降低驗證節點對運算能力的要求，使任何人都能運行節點，進一步提升去中心化程度。",
            "totalReturns": "320000.00000000000000000000",
            "stakingStartTime": 1746698400000,
            "stakingEndTime": 1747303200000,
            "displayStartTime": 1746689400000,
            "displayEndTime": 1746689400000,
            "pools": [
              {
                "poolId": "681c19ae4dc05a0001ac11aa",
                "stakingToken": "KCS",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/60c74375db892b0006d819a9_KCS.png",
                "earnTokenAmount": "160000",
                "totalStakingAmount": "2507199.33365776",
                "totalStakingParticipants": 3542,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "3",
                "tokenScale": null,
                "stakingStartTime": 1746698400000,
                "stakingEndTime": 1747303200000,
                "specificType": 0,
                "specificTag": null,
                "annualPercentageRate": 2,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-shardeum-shm-on-kucoin-gempool"
              },
              {
                "poolId": "681c19fc4dc05a0001ac11ab",
                "stakingToken": "SHM",
                "stakingTokenLogo": "https://assets-currency.kucoin.plus/681b0537388de70001756ed4_logo%20%2810%29.png",
                "earnTokenAmount": "160000",
                "totalStakingAmount": "2809818.9285933",
                "totalStakingParticipants": 1653,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "10",
                "tokenScale": null,
                "stakingStartTime": 1746698400000,
                "stakingEndTime": 1747303200000,
                "specificType": 0,
                "specificTag": null,
                "annualPercentageRate": 3,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-shardeum-shm-on-kucoin-gempool"
              }
            ],
            "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-shardeum-shm-on-kucoin-gempool",
            "mediaInfo": "[{\"value\":\"https://shardeum.org/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/shardeum\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://shardeum.org/Shardeum_Whitepaper.pdf\",\"mediaName\":\"Whitepaper\"}]"
          },
          {
            "campaignId": "68072e901729bd00018d3ead",
            "campaignName": "ZORA GemPool",
            "earnTokenName": "ZORA",
            "earnTokenLogo": "https://assets-currency.kucoin.plus/68072030c6b84c00013fef54_logo%20%287%29.png",
            "earnTokenOverview": "貼文即代幣的社交網路。",
            "totalReturns": "20000000.00000000000000000000",
            "stakingStartTime": 1745326800000,
            "stakingEndTime": 1746018000000,
            "displayStartTime": 1745302800000,
            "displayEndTime": 1745302800000,
            "pools": [
              {
                "poolId": "68072fa1dda3990001019707",
                "stakingToken": "KCS",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/60c74375db892b0006d819a9_KCS.png",
                "earnTokenAmount": "12000000",
                "totalStakingAmount": "2126388.43513204",
                "totalStakingParticipants": 3525,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "3",
                "tokenScale": null,
                "stakingStartTime": 1745326800000,
                "stakingEndTime": 1745931600000,
                "specificType": 0,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-zora-zora-on-kucoin-gempool"
              },
              {
                "poolId": "680730da6bf1260001b6a089",
                "stakingToken": "ZORA",
                "stakingTokenLogo": "https://assets-currency.kucoin.plus/68072030c6b84c00013fef54_logo%20%287%29.png",
                "earnTokenAmount": "8000000",
                "totalStakingAmount": "93757743.45387327",
                "totalStakingParticipants": 3800,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "10",
                "tokenScale": null,
                "stakingStartTime": 1745413200000,
                "stakingEndTime": 1746018000000,
                "specificType": 0,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-zora-zora-on-kucoin-gempool"
              }
            ],
            "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-zora-zora-on-kucoin-gempool",
            "mediaInfo": "[{\"value\":\"https://zora.co/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/zora?s=21&t=z5JfrEaTMkHxjrh1Y4ilwQ\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://zora.co/writings/the-ticker-is-zora\",\"mediaName\":\"Whitepaper\"}]"
          },
          {
            "campaignId": "6804f81c1729bd00018d3ea8",
            "campaignName": "EPT GemPool",
            "earnTokenName": "EPT",
            "earnTokenLogo": "https://assets-currency.kucoin.plus/6804f234dca50400012e76b3_logo.png",
            "earnTokenOverview": "Balance 是適用於社交和遊戲的新一代 AI+Web3 協定和框架，它無縫整合了 AI 技術、區塊鏈技術和去中心化應用程式。Balance 將 AI Agent（智慧型自適應數字夥伴）與 Key Node（管理並保護網路安全）相結合，為娛樂、生產力等領域打造了高度互動的去中心化生態。",
            "totalReturns": "6250000.00000000000000000000",
            "stakingStartTime": 1745236800000,
            "stakingEndTime": 1745841600000,
            "displayStartTime": 1745226000000,
            "displayEndTime": 1745226000000,
            "pools": [
              {
                "poolId": "6804f8bc65503100011d92ac",
                "stakingToken": "KCS",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/60c74375db892b0006d819a9_KCS.png",
                "earnTokenAmount": "3150000",
                "totalStakingAmount": "2234876.66704011",
                "totalStakingParticipants": 2572,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "3",
                "tokenScale": null,
                "stakingStartTime": 1745236800000,
                "stakingEndTime": 1745841600000,
                "specificType": 0,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-balance-ept-on-kucoin-gempool-exclusive-rewards-await-new-users"
              },
              {
                "poolId": "6804f9701729bd00018d3ea9",
                "stakingToken": "USDT",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                "earnTokenAmount": "600000",
                "totalStakingAmount": "2488307.36302397",
                "totalStakingParticipants": 223,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "10",
                "tokenScale": null,
                "stakingStartTime": 1745236800000,
                "stakingEndTime": 1745841600000,
                "specificType": 1,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-balance-ept-on-kucoin-gempool-exclusive-rewards-await-new-users"
              },
              {
                "poolId": "6804f9bc65503100011d92ad",
                "stakingToken": "EPT",
                "stakingTokenLogo": "https://assets-currency.kucoin.plus/6804f234dca50400012e76b3_logo.png",
                "earnTokenAmount": "2500000",
                "totalStakingAmount": "91710391.72519103",
                "totalStakingParticipants": 2779,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "10",
                "tokenScale": null,
                "stakingStartTime": 1745236800000,
                "stakingEndTime": 1745841600000,
                "specificType": 0,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-balance-ept-on-kucoin-gempool-exclusive-rewards-await-new-users"
              }
            ],
            "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-balance-ept-on-kucoin-gempool-exclusive-rewards-await-new-users",
            "mediaInfo": "[{\"value\":\"https://balance.fun/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/RealBalanceFun\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://balancefun.gitbook.io/balance\",\"mediaName\":\"Whitepaper\"}]"
          },
          {
            "campaignId": "67f73b164e4f770001a7a878",
            "campaignName": "FREEDOG GemPool",
            "earnTokenName": "FREEDOG",
            "earnTokenLogo": "https://assets-currency.kucoin.plus/67f4f2aa4edcd00001521819_logo%20%287%29.png",
            "earnTokenOverview": "一個 Web3 AI 代理項目，植根於自由與去中心化的理念，團結各地社群。源於杜羅夫事件，象徵對現實世界中心化權力的反抗。秉持比特幣的去中心化精神，為用戶提供以 AI 驅動的平台，讓其能夠在一個抗審查、以私隱為先的生態中自由互動。",
            "totalReturns": "100000000.00000000000000000000",
            "stakingStartTime": 1744286400000,
            "stakingEndTime": 1745323200000,
            "displayStartTime": 1744266600000,
            "displayEndTime": 1744266600000,
            "pools": [
              {
                "poolId": "67f73b868d9b720001a0c3b7",
                "stakingToken": "USDT",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                "earnTokenAmount": "10000000",
                "totalStakingAmount": "2473250.27049068",
                "totalStakingParticipants": 233,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "10",
                "tokenScale": null,
                "stakingStartTime": 1744286400000,
                "stakingEndTime": 1744891200000,
                "specificType": 1,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-freedogs-freedog-on-kucoin-gempool-exclusive-rewards-await-new-users"
              },
              {
                "poolId": "67f73bc68d9b720001a0c3b8",
                "stakingToken": "KCS",
                "stakingTokenLogo": "https://assets-currency.kucoin.com/60c74375db892b0006d819a9_KCS.png",
                "earnTokenAmount": "60000000",
                "totalStakingAmount": "2445120.37866747",
                "totalStakingParticipants": 3299,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "3",
                "tokenScale": null,
                "stakingStartTime": 1744286400000,
                "stakingEndTime": 1744891200000,
                "specificType": 0,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-freedogs-freedog-on-kucoin-gempool-exclusive-rewards-await-new-users"
              },
              {
                "poolId": "67f73c044e4f770001a7a879",
                "stakingToken": "FREEDOG",
                "stakingTokenLogo": "https://assets-currency.kucoin.plus/67f4f2aa4edcd00001521819_logo%20%287%29.png",
                "earnTokenAmount": "30000000",
                "totalStakingAmount": "51336349.09419864",
                "totalStakingParticipants": 12586,
                "stakingStartDate": null,
                "stakingEndDate": null,
                "minStakingAmount": "10",
                "tokenScale": null,
                "stakingStartTime": 1744718400000,
                "stakingEndTime": 1745323200000,
                "specificType": 0,
                "specificTag": null,
                "jumpLink": "https://www.kucoin.com/announcement/en-introducing-freedogs-freedog-on-kucoin-gempool-exclusive-rewards-await-new-users"
              }
            ],
            "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-freedogs-freedog-on-kucoin-gempool-exclusive-rewards-await-new-users",
            "mediaInfo": "[{\"mediaName\":\"Telegram\",\"value\":\"https://t.me/theFreeDogs_bot\"},{\"mediaName\":\"X (Twitter)\",\"value\":\"https://x.com/theFreeDogs_bot\"}]"
          }
        ]
      }
    },
  },
  {
    url: '/_api/gem-staking-front/gempool/staking/earnTokenList',
    disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": [
          "NXPC",
          "WEN",
          "SHIB",
          "BN",
          "ORDER",
          "MAK",
          "SUNDOG",
          "CATI",
          "EGP",
          "UNIO",
          "LAY3R",
          "PUFFER",
          "DEEP",
          "CROS",
          "SMILE",
          "ARCA",
          "GODL",
          "PGC",
          "SWELL",
          "NOOB",
          "ASI",
          "SAMO",
          "GOATS",
          "MOZ",
          "BLUE",
          "GLS",
          "TEVA",
          "MTOS",
          "SYNTH",
          "TREAT",
          "CLAY",
          "DUCK",
          "ANLOG",
          "YULI",
          "SLC",
          "HQ",
          "RIZ",
          "MEMHASH",
          "FORM",
          "USDT",
          "GX",
          "SLING",
          "MINT",
          "IMT",
          "SEED",
          "FREEDOG",
          "DOGE",
          "EPT",
          "ZORA",
          "SHM"
        ]
      }
    },
  },
  {
    url: '/_api/gem-staking-front/gempool/staking/campaign/details',
    disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": {
          "campaignId": "68232d2d5f3ce000013a2af6",
          "campaignName": "NXPC GemPool",
          "earnTokenName": "NXPC",
          "earnTokenLogo": "https://assets-currency.kucoin.com/68232ac7c6ca2500012b8560_logo.png",
          "earnTokenOverview": "NXPC 是 MapleStory Universe 生態的基礎代幣，旨在捕捉及體現遊戲內活動和整體生態增長的價值。它具備多重功能：作為 Layer 1 網絡的交易手續費代幣、用於購買 NFT 物品組合的交換媒介，以及 NESO（與 NXPC 錨定的遊戲貨幣）的儲備資產。玩家可將 NXPC 轉換成 NESO 以進行物品升級，而創作者則透過創造價值獲得 NXPC 獎勵，並遵循透明且基於減半機制的發放模式。NXPC 的需求來自短期和長期用途：短期內，它推動遊戲玩法，透過 NXPC 創造稀有物品，使用 NESO 強化物品，而相關的網絡活動亦會消耗 NXPC 作為網絡費用。在最新的公開測試中，流通中的 76% NXPC 已實際用於遊戲，展現出真實的用戶需求。長期而言，NXPC 將成為創作者經濟的重要基石，協助第三方開發者透過生態 SDK 開發新應用，獲得 NXPC 獎勵，並吸引傳統遊戲圈以外的新用戶。隨著更多新應用擴大 NFT 和 NESO 的使用場景，也進一步鞏固了 NXPC 作為 MapleStory Universe 核心價值橋樑的地位。",
          "totalReturns": "1000000",
          "stakingStartTime": 1747144800000,
          "stakingEndTime": 1747749600000,
          "displayStartTime": 1747144800000,
          "displayEndTime": 1747144800000,
          "openBonusTask": 1,
          "userBonusCoefficient": "0",
          "pools": [
            {
              "poolId": "68232da75f3ce000013a2af8",
              "stakingToken": "KCS",
              "stakingTokenLogo": "https://assets-currency.kucoin.com/60c74375db892b0006d819a9_KCS.png",
              "earnTokenAmount": "800000",
              "totalStakingAmount": "2639149.29479867",
              "totalStakingParticipants": 4734,
              "stakingStartDate": null,
              "stakingEndDate": null,
              "stakingStartTime": 1747144800000,
              "stakingEndTime": 1747749600000,
              "myStakingInfo": null,
              "maximumDailyRewards": "114285.71428571",
              "tokenScale": 8,
              "minStakingAmount": "3",
              "specificType": 0,
              "specificTag": null,
              "annualPercentageRate": 1.1,
              "jumpLink": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users"
            },
            {
              "poolId": "68232e055f3ce000013a2af9",
              "stakingToken": "USDT",
              "stakingTokenLogo": "https://assets-currency.kucoin.com/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
              "earnTokenAmount": "200000",
              "totalStakingAmount": "36518779.70436969",
              "totalStakingParticipants": 4034,
              "stakingStartDate": null,
              "stakingEndDate": null,
              "stakingStartTime": 1747144800000,
              "stakingEndTime": 1747749600000,
              "myStakingInfo": null,
              "maximumDailyRewards": "28571.42857142",
              "tokenScale": 8,
              "minStakingAmount": "10",
              "specificType": 1,
              "specificTag": null,
              "jumpLink": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users"
            }
          ],
          "userBonusTaskFinish": 0,
          "earnDistributeTime": "15:00:00",
          "mediaInfo": "[{\"value\":\"https://msu.io/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/MaplestoryU\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://docs.nexpace.io/\",\"mediaName\":\"Whitepaper\"}]",
          "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users"
        }
      }
    },
  },
  {
    url: '/_api/currency-front/gem/customer/ongoingGem',
    disabled: true,
    response: (_req, res) => {
      return {
        "success": true,
        "code": "200",
        "msg": "success",
        "retry": false,
        "data": {
          "gemPad": {
            "seq": 9,
            "typeName": "gemPad",
            "totalRaised": "45880000.000000",
            "totalParticipants": 1351058,
            "averageAth": "39.819200",
            "totalProjects": 28,
            "details": [
              {
                "logoUrl": "https://assets-currency.kucoin.com/663884f2b1696300018c410a_%E5%B8%81%E7%A7%8Dlogo%403x%201.png",
                "shortName": "LFT",
                "fullName": "Lifeform",
                "fire": true,
                "worldPremiere": true,
                "shareImageUrl": "https://assets.staticimg.com/cms/media/3jKFxI2kFP3XkCTWtRkGY6V77LI1uJsbqLdL19pEO.jpg",
                "startActivity": 1714989600000,
                "endActivity": 1724899043000,
                "jumpUrl": "/spotlight_r6/161_LFT",
                "campaignAmount": "5000000",
                "quoteCurrency": "USDT",
                "price": "0.03",
                "activityRegistrationCount": 70727
              }
            ]
          },
          "gemPool": {
            "seq": 10,
            "typeName": "gemPool",
            "totalStaked": "444084095.000000",
            "totalParticipants": 585510,
            "averageAth": "22.498300",
            "totalProjects": 85,
            "details": [
              {
                "logoUrl": "https://assets-currency.kucoin.com/6735d87ab115640001e50518_ponder-logo.png",
                "shortName": "PNDR",
                "fullName": "Ponder",
                "fire": true,
                "worldPremiere": true,
                "shareImageUrl": "https://assets.staticimg.com/cms/media/1VOSf8vItmrKCWqPqBcKBob65iQ2x7K4DHKnBUc7j.jpg",
                "startActivity": 1731661201000,
                "endActivity": 1731693601000,
                "jumpUrl": "/announcement/en-ponder-pndr-is-available-on-burningdrop",
                "burningDropProductId": 3063,
                "productUpperLimit": "750000.00000000000000000000",
                "lockPeriod": 20,
                "userUpperLimit": "300.00000000000000000000",
                "quoteCurrency": "KCS"
              }
            ]
          },
          "gemNewPool": {
            "seq": 1,
            "typeName": "gemNewPool",
            "totalStaked": "2558231418",
            "totalParticipants": 462864,
            "averageAth": "9.321500",
            "totalProjects": 47,
            "details": [
              {
                "logoUrl": "https://assets-currency.kucoin.com/682addcb37fb020001fadf77_logo.png",
                "shortName": "TGT",
                "fullName": "Tokyo Games Token",
                "fire": null,
                "shareImageUrl": null,
                "startActivity": 1747648800000,
                "endActivity": 1748426400000,
                "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-tokyogamestoken-tgt-on-kucoin-gempool-exclusive-rewards-await-new-users",
                "totalReturns": "4285714.00000000000000000000",
                "mediaInfo": "[{\"value\":\"https://tokyogamestoken.com/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/TOKYOGAMES_FDN\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://tokyogamestoken.gitbook.io/tgt-whitepaper\",\"mediaName\":\"Whitepaper\"}]",
                "poolInfoList": [
                  {
                    "stakingToken": "TGT",
                    "stakingTokenLogo": "https://assets-currency.kucoin.com/682addcb37fb020001fadf77_logo.png",
                    "earnTokenAmount": "1720000",
                    "totalStakingAmount": "0",
                    "totalStakingParticipants": 0,
                    "stakingStartTime": 1747821600000,
                    "stakingEndTime": 1748426400000,
                    "annualPercentageRate": 1.1
                  },
                  {
                    "stakingToken": "KCS",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/60c74375db892b0006d819a9_KCS.png",
                    "earnTokenAmount": "2100000",
                    "totalStakingAmount": "69667.55896928",
                    "totalStakingParticipants": 62,
                    "stakingStartTime": 1747648800000,
                    "annualPercentageRate": 1.2,
                    "stakingEndTime": 1748253600000
                  },
                  {
                    "stakingToken": "USDT",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                    "earnTokenAmount": "465714",
                    "totalStakingAmount": "415848.88206845",
                    "totalStakingParticipants": 8,
                    "annualPercentageRate": 1.3,
                    "stakingStartTime": 1747648800000,
                    "stakingEndTime": 1748253600000
                  }
                ]
              },
              {
                "logoUrl": "https://assets-currency.kucoin.com/68232ac7c6ca2500012b8560_logo.png",
                "shortName": "NXPC",
                "fullName": "NEXPACE",
                "fire": null,
                "shareImageUrl": null,
                "startActivity": 1747144800000,
                "endActivity": 1747749600000,
                "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users",
                "totalReturns": "1000000.00000000000000000000",
                "mediaInfo": "[{\"value\":\"https://msu.io/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/MaplestoryU\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://docs.nexpace.io/\",\"mediaName\":\"Whitepaper\"}]",
                "poolInfoList": [
                  {
                    "stakingToken": "KCS",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/60c74375db892b0006d819a9_KCS.png",
                    "earnTokenAmount": "800000",
                    "totalStakingAmount": "2644047.18914592",
                    "totalStakingParticipants": 4771,
                    "annualPercentageRate": 1.1,
                    "stakingStartTime": 1747144800000,
                    "stakingEndTime": 1747749600000
                  },
                  {
                    "stakingToken": "USDT",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                    "earnTokenAmount": "200000",
                    "totalStakingAmount": "36754364.26798255",
                    "totalStakingParticipants": 4073,
                    "annualPercentageRate": 1.2,
                    "stakingStartTime": 1747144800000,
                    "stakingEndTime": 1747749600000
                  }
                ]
              },
              {
                "logoUrl": "https://assets-currency.kucoin.com/68232ac7c6ca2500012b8560_logo.png",
                "shortName": "NXPC2",
                "fullName": "NEXPACE2",
                "fire": null,
                "shareImageUrl": null,
                "startActivity": 1748144800000,
                "endActivity": 1748244800000,
                "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users",
                "totalReturns": "1000000.00000000000000000000",
                "mediaInfo": "[{\"value\":\"https://msu.io/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/MaplestoryU\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://docs.nexpace.io/\",\"mediaName\":\"Whitepaper\"}]",
                "poolInfoList": [
                  {
                    "stakingToken": "KCS",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/60c74375db892b0006d819a9_KCS.png",
                    "earnTokenAmount": "800000",
                    "totalStakingAmount": "2644047.18914592",
                    "totalStakingParticipants": 4771,
                    "stakingStartTime": 1748144800000,
                    "stakingEndTime": 1748244800000
                  },
                  {
                    "stakingToken": "USDT",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                    "earnTokenAmount": "200000",
                    "totalStakingAmount": "36754364.26798255",
                    "totalStakingParticipants": 4073,
                    "stakingStartTime": 1748144800000,
                    "stakingEndTime": 1748244800000
                  }
                ]
              },
              {
                "logoUrl": "https://assets-currency.kucoin.com/68232ac7c6ca2500012b8560_logo.png",
                "shortName": "NXPC3",
                "fullName": "NEXPACE3",
                "fire": null,
                "shareImageUrl": null,
                "startActivity": 1747144800000,
                "endActivity": 1747244800000,
                "announcementAddress": "https://www.kucoin.com/announcement/en-introducing-nexpace-nxpc-on-kucoin-gempool-exclusive-rewards-await-new-users",
                "totalReturns": "1000000.00000000000000000000",
                "mediaInfo": "[{\"value\":\"https://msu.io/\",\"mediaName\":\"Website\"},{\"value\":\"https://x.com/MaplestoryU\",\"mediaName\":\"X (Twitter)\"},{\"value\":\"https://docs.nexpace.io/\",\"mediaName\":\"Whitepaper\"}]",
                "poolInfoList": [
                  {
                    "stakingToken": "KCS",
                    "stakingTokenLogo": "https://assets-currency.kucoin.plus/60c74375db892b0006d819a9_KCS.png",
                    "earnTokenAmount": "800000",
                    "totalStakingAmount": "2644047.18914592",
                    "totalStakingParticipants": 4771,
                    "annualPercentageRate": 1.1,
                    "stakingStartTime": 1748144800000,
                    "stakingEndTime": 1748244800000
                  },
                  // {
                  //   "stakingToken": "USDT",
                  //   "stakingTokenLogo": "https://assets-currency.kucoin.plus/65ee9c3a1a5e5200016203e0_USDT%20logo.png",
                  //   "earnTokenAmount": "200000",
                  //   "totalStakingAmount": "36754364.26798255",
                  //   "totalStakingParticipants": 4073,
                  //   "annualPercentageRate": 1.2,
                  //   "stakingStartTime": 1748144800000,
                  //   "stakingEndTime": 1748244800000
                  // }
                ]
              }
            ]
          },
          "gemPreMarket": {
            "seq": 4,
            "typeName": "gemPreMarket",
            "totalStaked": "57082936.043923214",
            "totalParticipants": 369794,
            "averageAth": "10.200000",
            "totalProjects": 57,
            "details": [
              {
                "logoUrl": "https://assets.staticimg.com/cms/media/BrVeXM8myceS3MlCQhEsqdFITM2gi0bY8iKuA7Apg.png",
                "shortName": "SOON",
                "fullName": "SOON",
                "fire": null,
                "shareImageUrl": null,
                "startActivity": 1744797600,
                "endActivity": 1775897889,
                "deliveryCurrency": null,
                "displayTradeEndAt": false,
                "sort": 1,
                "deliveryTime": 0,
                "lastTradePrice": "0.431",
                "avgPrice": "0.287",
                "offerCurrency": "USDT",
                "preDeliveryTime": 0
              }
            ]
          },
          "gemVote": {
            "seq": 5,
            "typeName": "gemVote",
            "activityPeriods": 16,
            "totalParticipants": 666888,
            "winnerProjects": 19,
            "totalProjects": 135,
            "details": [
              {
                "logoUrl": null,
                "shortName": null,
                "fullName": null,
                "startActivity": 1746115234000,
                "endActivity": 1746600000000,
                "title": "KuCoin GemVote 第 16 階段",
                "voteStartAt": 1746115234000,
                "voteEndAt": 1746600000000,
                "projects": [
                  {
                    "id": "6814e5f3ab3b340001935df0",
                    "activityId": "6814e5f3ab3b340001935deb",
                    "projectId": "6814902406c7d40001206c4d",
                    "voteNumber": 6857,
                    "voteResult": 1,
                    "status": 0,
                    "project": "Housecoin",
                    "currency": "House",
                    "description": "Housecoin (House) 是 Solana 區塊鏈上的記憶代幣",
                    "logoUrl": "https://assets.staticimg.com/cms/media/jQn1Vxts2nBQ0pzou5sSR0DggNwwoQpj20G1iZtfS.jpg",
                    "winAt": 1746600000000
                  },
                  {
                    "id": "6814e5f3ab3b340001935ded",
                    "activityId": "6814e5f3ab3b340001935deb",
                    "projectId": "681486796bf0230001552baf",
                    "voteNumber": 3857,
                    "voteResult": 0,
                    "status": 0,
                    "project": "Mikami",
                    "currency": "Mikami",
                    "description": "由日本流行歌手Yua Mikami在Solana上推出的一個新的Memecoin項目。",
                    "logoUrl": "https://assets.staticimg.com/cms/media/gccc920uNnAs1Wgg6HrS00FKXCW76bt2alDrkKoud.jpg",
                    "winAt": 1746600000000
                  },
                  {
                    "id": "6814e5f3ab3b340001935dee",
                    "activityId": "6814e5f3ab3b340001935deb",
                    "projectId": "68148fcc06c7d40001206c49",
                    "voteNumber": 1575,
                    "voteResult": 0,
                    "status": 0,
                    "project": "Let's BONK",
                    "currency": "LetsBONK",
                    "description": "Let's BONK 是 Solana 區塊鏈上的記憶代幣",
                    "logoUrl": "https://assets.staticimg.com/cms/media/OVkvVDa4MHEy8RkTXhLAMNn35Ioz1kdHu4skVfdzJ.jpg",
                    "winAt": 1746600000000
                  },
                  {
                    "id": "6814e5f3ab3b340001935def",
                    "activityId": "6814e5f3ab3b340001935deb",
                    "projectId": "68148ffe06c7d40001206c4b",
                    "voteNumber": 589,
                    "voteResult": 0,
                    "status": 2,
                    "project": "New XAI gork",
                    "currency": "gork",
                    "description": "新 XAI gork 是 Solana 區塊鏈上的記憶代幣",
                    "logoUrl": "https://assets.staticimg.com/cms/media/aCHiVmGI0ShFze1gtMg0NFJeaPykRTEYtwA51bL6A.jpg",
                    "winAt": 1746600000000
                  }
                ]
              }
            ]
          },
          "gemSlot": {
            "seq": 2,
            "typeName": "gemSlot",
            "details": [
              {
                "id": "67f386cb35a8e4000767e21e",
                "logoUrl": "https://assets-currency.kucoin.com/67f371b7dca50400012bb69a_logo.png",
                "shortName": "TAI",
                "fullName": "TARS AI",
                "fire": null,
                "worldPremiere": null,
                "shareImageUrl": null,
                "startActivity": 1744020000000,
                "endActivity": 1744624800000,
                "jumpUrl": null,
                "totalPool": null,
                "code": "tars-ai"
              }
            ]
          }
        }
      }
    },
  },
] as IMockMethod[];
