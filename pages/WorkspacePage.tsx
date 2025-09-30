import React, { useState, useCallback, useEffect } from 'react';
import { generateIcon } from '../services/geminiService';
import { getAssets, addAsset, uploadImage } from '../services/supabaseService';
import type { Asset, Workspace, Style } from '../types';
import StylePreview from '../components/StylePreview';
import AssetForm from '../components/AssetForm';
import AssetList from '../components/AssetList';
import StyleEditorModal from '../components/StyleEditorModal';
import ThemeToggle from '../components/ThemeToggle';

interface WorkspacePageProps {
  workspace: Workspace;
  onStyleUpdate: (workspaceId: string, newStyle: Style) => void;
  onBack: () => void;
}

const WorkspacePage: React.FC<WorkspacePageProps> = ({ workspace, onStyleUpdate, onBack }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingAssets, setIsFetchingAssets] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isStyleModalOpen, setIsStyleModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAssets = async () => {
      if (!workspace.id) return;
      setIsFetchingAssets(true);
      setError(null);
      try {
        const fetchedAssets = await getAssets(workspace.id);
        setAssets(fetchedAssets);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load assets.');
        console.error(err);
      } finally {
        setIsFetchingAssets(false);
      }
    };
    fetchAssets();
  }, [workspace.id]);

  const handleStyleUpdate = (newStyle: Style) => {
    onStyleUpdate(workspace.id, newStyle);
    setIsStyleModalOpen(false);
  };

  const handleGenerate = useCallback(async (name: string, description: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Generate the image using Gemini
      const imageDataUrl = await generateIcon(name, description, workspace.style);

      // 2. Upload the image to Supabase Storage
      const imageUrl = await uploadImage(imageDataUrl, name);
      
      // 3. Create the asset record in the Supabase database
      const newAssetData: Omit<Asset, 'id' | 'createdAt'> = {
        name,
        description,
        imageUrl,
        style: workspace.style,
        workspaceId: workspace.id,
      };
      const savedAsset = await addAsset(newAssetData);

      // 4. Update local state
      setAssets(prevAssets => [savedAsset, ...prevAssets]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during asset creation.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [workspace.style, workspace.id]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-surface/80 backdrop-blur-sm border-b border-border-default shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex justify-between items-center h-16">
            <button onClick={onBack} className="text-accent hover:text-accent-hover text-sm font-medium">
              &larr; Dashboard
            </button>
            <h1 className="text-xl sm:text-2xl font-medium text-foreground tracking-wide whitespace-nowrap">
              {workspace.name}
            </h1>
            <div className="flex items-center space-x-4">
               <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1 bg-surface p-6 rounded-xl border border-border-default self-start">
            <h2 className="text-lg font-medium text-foreground mb-3">
              Workspace Info
            </h2>
            <p className="text-sm text-foreground-secondary mb-4">{workspace.description}</p>
            <StylePreview style={workspace.style} onEdit={() => setIsStyleModalOpen(true)} />
          </aside>

          <section className="lg:col-span-2">
            <AssetForm onGenerate={handleGenerate} isLoading={isLoading} />
            {error && (
              <div className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <AssetList assets={assets} isFetching={isFetchingAssets} />
          </section>
        </div>
      </main>

      <StyleEditorModal
        isOpen={isStyleModalOpen}
        style={workspace.style}
        onClose={() => setIsStyleModalOpen(false)}
        onSave={handleStyleUpdate}
      />
    </div>
  );
};

export default WorkspacePage;
