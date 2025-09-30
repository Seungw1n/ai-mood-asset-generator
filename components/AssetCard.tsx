import React from 'react';
import type { Asset } from '../types';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <div className="bg-surface rounded-lg overflow-hidden shadow-sm border border-border-default transition-transform hover:scale-105 duration-300">
      <img src={asset.imageUrl} alt={asset.name} className="w-full h-48 object-cover bg-surface-hover" />
      <div className="p-4">
        <h3 className="text-lg font-medium text-foreground">{asset.name}</h3>
        <p className="text-sm text-foreground-secondary mt-1 mb-3">{asset.description}</p>
        <div className="text-xs">
          <p className="font-semibold text-foreground">Style Details:</p>
          <ul className="list-disc list-inside text-foreground-secondary">
            <li><span className="font-medium text-foreground">Style:</span> {asset.style.style}</li>
            <li><span className="font-medium text-foreground">Material:</span> {asset.style.material}</li>
            <li><span className="font-medium text-foreground">Finish:</span> {asset.style.finish}</li>
            <li><span className="font-medium text-foreground">Texture:</span> {asset.style.texture}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;