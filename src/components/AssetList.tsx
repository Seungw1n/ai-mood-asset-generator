import React from 'react';
import type { Asset } from '../types';
import AssetCard from './AssetCard';

interface AssetListProps {
  assets: Asset[];
  isFetching?: boolean;
}

const AssetList: React.FC<AssetListProps> = ({ assets, isFetching }) => {
  return (
    <div className="mt-8">
       <h2 className="text-xl font-medium text-foreground mb-4">Generated Assets</h2>
       <div className="text-center py-12 bg-surface border-2 border-dashed border-border-default rounded-lg">
        {isFetching ? (
            <p className="text-foreground-secondary">Loading assets...</p>
        ) : assets.length === 0 ? (
            <p className="text-foreground-secondary">Your generated assets will appear here.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {assets.map((asset) => (
                    <AssetCard key={asset.id} asset={asset} />
                ))}
            </div>
        )}
       </div>
    </div>
  );
};

export default AssetList;
