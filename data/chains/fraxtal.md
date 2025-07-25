---
name: Fraxtal
chainId: 252
nativeCurrency: FRAX
color: "#3B82F6"
darkColor: "#2960B9"
logo: fraxtal.svg
parentOrganization: Frax Finance
website: https://frax.com
launchDate: 2024-02-01
maxBlockSize: 30
technology:
  type: Optimistic Rollup
  settlementLayer: Ethereum
  isL2: true
  isEVM: true
  stack: OP Stack
contractLanguages:
  - name: Solidity
    url: https://soliditylang.org
    details: Primary
  - name: Vyper
    url: https://vyper.readthedocs.io
  - name: Yul / Yul+
    url: https://docs.soliditylang.org/en/latest/yul.html
  - name: Huff
    url: https://huff.sh/
docs:
  - https://docs.frax.com/
blockscanners:
  - name: Fraxscan
    url: https://fraxscan.com
    type: official
testnets:
  - name: Fraxtal Testnet
    chainId: 2522
    url: https://holesky.fraxscan.com
    description: Fraxtal testnet for deploying and testing applications on the Fraxtal Layer 2 network.
    faucets: []
    rpcs:
      - https://rpc.testnet.frax.com
      - https://fraxtal-holesky-rpc.publicnode.com
rpcs:
  - name: Frax
    url: https://rpc.frax.com
    type: official
  - name: dRPC
    url: https://fraxtal.drpc.org
    type: public
  - name: Tenderly
    url: https://fraxtal.gateway.tenderly.co
    type: private
  - name: PublicNode
    url: https://fraxtal-rpc.publicnode.com
    type: public
  - name: Histori
    url: https://node.histori.xyz/fraxtal-mainnet/8ry9f6t9dct1se2hlagxnd9n2a
    type: public
sourceCode:
  - name: Github Organization
    url: https://github.com/FraxFinance
forums:
  - name: Discord
    url: https://discord.com/invite/fraxfinance
sdks:
tools:
---

An OP Stack-based L2 from Frax Finance with centralized infra, custom data availability, and incentive mechanisms for user and dev activity.

- **Security**  
  - Centralized sequencer and multisig-controlled upgrades (no delay).  
  - No fraud proofs or permissionless verifiers — state validity depends on sequencer honesty.  
  - Uses custom off-chain data availability — no Ethereum calldata fallback.

- **Infra**  
  - Built on OP Stack (EVM-equivalent).  
  - Hourly state commitments to Ethereum; data submitted ~30 min later.  
  - Native gas token is FRAX.  

- **Incentives**  
  - “Flox” system rewards users/devs with FXTL points based on activity.  
  - FXTL has no formal token mechanics yet; subject to Frax governance.

- **Performance**  
  - Sub-cent fees; throughput comparable to other OP Stack chains.  
  - No ZK or fraud-proof enhancements.  

- **Trade-offs**  
  - No trustless settlement — sequencer has full control over execution and ordering.  
  - Off-chain DA layer means data withholding is possible.  
  - Multisig-controlled upgrades without delay → high governance risk.  
  - Incentive model introduces complexity without formal guarantees.

- **Why use it**  
  - Suitable for apps that want EVM compatibility and low fees, and are comfortable with Frax-controlled infra and incentive mechanisms.  
  - Not appropriate for trust-minimized or censorship-sensitive applications.  