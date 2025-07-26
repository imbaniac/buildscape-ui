<script>
	import { overviewStore } from '$lib/stores/overviewStore';
	
	let overviewState = $derived($overviewStore);
	let overviewData = $derived(overviewState?.data);

	function formatNumber(num) {
		if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
		if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
		if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
		return num.toString();
	}

	function formatCurrency(num) {
		return '$' + formatNumber(num);
	}
</script>

<header class="header-container">
	<div class="resource-bar">
		<div class="resource-item">
			<span class="resource-icon">🏝️</span>
			<div class="resource-value">
				<span class="resource-number">{overviewData?.active_chains || 0}</span>
				<span class="resource-label">Chains</span>
			</div>
		</div>

		<div class="resource-divider"></div>

		<div class="resource-item">
			<span class="resource-icon">👥</span>
			<div class="resource-value">
				<span class="resource-number">{formatNumber(overviewData?.total_active_addresses || 0)}</span>
				<span class="resource-label">Population</span>
			</div>
		</div>

		<div class="resource-divider"></div>

		<div class="resource-item">
			<span class="resource-icon">⚡</span>
			<div class="resource-value">
				<span class="resource-number">{formatNumber(overviewData?.total_transactions || 0)}</span>
				<span class="resource-label">Transactions</span>
			</div>
		</div>

		<div class="resource-divider"></div>

		<div class="resource-item">
			<span class="resource-icon">💎</span>
			<div class="resource-value">
				<span class="resource-number">{formatCurrency(overviewData?.total_tvl || 0)}</span>
				<span class="resource-label">TVL</span>
			</div>
		</div>
	</div>
</header>

<style>
	.header-container {
		position: fixed;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		padding: 12px 0;
	}

	.resource-bar {
		display: flex;
		align-items: center;
		gap: 0;
		background: linear-gradient(180deg, #2a2416 0%, #1f1a12 100%);
		border: 2px solid #4a3f2a;
		border-radius: 8px;
		padding: 8px 20px;
		box-shadow: 
			0 4px 12px rgba(0, 0, 0, 0.6),
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.3);
	}

	.resource-item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 16px;
	}

	.resource-icon {
		font-size: 24px;
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
	}

	.resource-value {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.resource-number {
		font-size: 18px;
		font-weight: bold;
		color: #f4e4c1;
		text-shadow: 
			0 2px 4px rgba(0, 0, 0, 0.5),
			0 0 12px rgba(255, 215, 0, 0.2);
		line-height: 1;
	}

	.resource-label {
		font-size: 11px;
		color: #a89568;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-top: 2px;
	}

	.resource-divider {
		width: 1px;
		height: 32px;
		background: linear-gradient(180deg, 
			transparent 0%, 
			#4a3f2a 20%, 
			#4a3f2a 80%, 
			transparent 100%);
	}

	.resource-item:hover .resource-number {
		color: #ffd700;
		text-shadow: 
			0 2px 4px rgba(0, 0, 0, 0.5),
			0 0 20px rgba(255, 215, 0, 0.4);
	}

	@media (max-width: 768px) {
		.header-container {
			padding: 8px 16px;
			width: 100%;
		}

		.resource-bar {
			padding: 6px 12px;
			gap: 0;
		}

		.resource-item {
			padding: 0 8px;
		}

		.resource-icon {
			font-size: 20px;
		}

		.resource-number {
			font-size: 14px;
		}

		.resource-label {
			font-size: 9px;
		}
	}
</style>