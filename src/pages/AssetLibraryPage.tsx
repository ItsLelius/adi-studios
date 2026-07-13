import { useMemo, useState } from "react";
import {
  Copy,
  Download,
  ExternalLink,
  FileText,
  Folder,
  FolderOpen,
  Image,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { assetItems } from "../data/mockData";
import type { AssetCategory, AssetItem } from "../types";

type AssetLibraryPageProps = {
  onOpenSidebar: () => void;
};

const assetSections: Array<{
  key: AssetCategory;
  label: string;
  description: string;
}> = [
  {
    key: "pdf_brain",
    label: "PDF Brain",
    description: "Downloadable PDFs and system documents.",
  },
  {
    key: "prompts",
    label: "Prompts",
    description: "Plain text prompts with copy button.",
  },
  {
    key: "images",
    label: "Images",
    description: "Reference images and downloadable pictures.",
  },
  {
    key: "documents",
    label: "Documents",
    description: "Downloadable DOC files and written references.",
  },
];

export function AssetLibraryPage({ onOpenSidebar }: AssetLibraryPageProps) {
  const [selectedBrand, setSelectedBrand] = useState<string | null>(
    "Maya's Kitchen",
  );
  const [selectedCategory, setSelectedCategory] =
    useState<AssetCategory>("prompts");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const brands = useMemo(() => {
    return Array.from(new Set(assetItems.map((asset) => asset.brand)));
  }, []);

  const filteredAssets = useMemo(() => {
    return assetItems.filter((asset) => {
      const matchesBrand = selectedBrand ? asset.brand === selectedBrand : false;
      const matchesCategory = asset.category === selectedCategory;
      const matchesSearch = asset.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesBrand && matchesCategory && matchesSearch;
    });
  }, [selectedBrand, selectedCategory, search]);

  const selectedAsset =
    filteredAssets.find((asset) => asset.id === selectedAssetId) ??
    filteredAssets[0] ??
    null;

  const selectedSection = assetSections.find(
    (section) => section.key === selectedCategory,
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Asset Library"
        description="Downloadable PDFs, images, prompts, and production references."
        onOpenSidebar={onOpenSidebar}
        accent="cyan"
        pills={[
          {
            icon: FolderOpen,
            value: brands.length,
            label: "Page folders",
            accent: "cyan",
          },
          {
            icon: FileText,
            value: assetItems.filter((asset) => asset.type === "pdf").length,
            label: "PDF files",
            accent: "blue",
          },
          {
            icon: Image,
            value: assetItems.filter((asset) => asset.type === "image").length,
            label: "Images",
            accent: "violet",
          },
        ]}
      />

      <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-2xl border border-white/10 bg-[#111318] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
                Library
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Page folders and asset types.
              </p>
            </div>

            <button
              onClick={() => alert("Later: create new page folder")}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white transition hover:bg-blue-400"
              title="Add folder"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="scroll-panel min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="space-y-3">
              {brands.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-[#0B0D10] p-4 text-center">
                  <p className="text-sm font-semibold text-white">
                    No folders yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Add your first page folder.
                  </p>
                </div>
              ) : (
                brands.map((brand) => {
                  const activeBrand = selectedBrand === brand;

                  return (
                    <div
                      key={brand}
                      className={[
                        "rounded-xl border p-2 transition",
                        activeBrand
                          ? "border-cyan-500/30 bg-cyan-500/[0.05]"
                          : "border-white/5 bg-[#0B0D10]",
                      ].join(" ")}
                    >
                      <button
                        onClick={() => {
                          setSelectedBrand(brand);
                          setSelectedAssetId(null);
                          setSearch("");
                        }}
                        className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left transition hover:bg-white/5"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          {activeBrand ? (
                            <FolderOpen className="h-4 w-4 shrink-0 text-cyan-300" />
                          ) : (
                            <Folder className="h-4 w-4 shrink-0 text-slate-500" />
                          )}

                          <span
                            className={[
                              "truncate text-sm font-semibold",
                              activeBrand ? "text-white" : "text-slate-300",
                            ].join(" ")}
                          >
                            {brand}
                          </span>
                        </div>

                        <MoreHorizontal className="h-4 w-4 shrink-0 text-slate-600" />
                      </button>

                      {activeBrand && (
                        <div className="mt-1 space-y-1 border-l border-white/10 pl-3">
                          {assetSections.map((section) => {
                            const activeSection =
                              selectedCategory === section.key;

                            const count = assetItems.filter(
                              (asset) =>
                                asset.brand === brand &&
                                asset.category === section.key,
                            ).length;

                            return (
                              <button
                                key={section.key}
                                onClick={() => {
                                  setSelectedCategory(section.key);
                                  setSelectedAssetId(null);
                                  setSearch("");
                                }}
                                className={[
                                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                                  activeSection
                                    ? "bg-cyan-500/10 text-cyan-200"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white",
                                ].join(" ")}
                              >
                                <span>{section.label}</span>
                                <span className="text-xs text-slate-500">
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 min-w-0 flex-col rounded-2xl border border-white/10 bg-[#111318] p-5">
          <div className="mb-4 flex shrink-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-white">
                {selectedBrand ?? "No Folder Selected"} /{" "}
                {selectedSection?.label}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                {selectedSection?.description}
              </p>
            </div>

            <button
              onClick={() => alert("Later: Add asset CRUD modal")}
              className="flex w-fit items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              <Plus className="h-4 w-4" />
              Add Asset
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B0D10] px-3 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-slate-500" />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setSelectedAssetId(null);
              }}
              placeholder={`Search ${selectedSection?.label.toLowerCase()}...`}
              className="w-full min-w-0 bg-transparent text-sm text-slate-300 outline-none placeholder:text-slate-600"
            />
          </div>

          <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[170px_minmax(0,1fr)]">
            <div className="scroll-panel min-h-0 overflow-y-auto pr-1">
              {filteredAssets.length === 0 ? (
                <EmptyState
                  title="No assets here yet"
                  description="Add a PDF, prompt, document, or image to this section."
                />
              ) : (
                <div className="space-y-2">
                  {filteredAssets.map((asset) => (
                    <AssetListItem
                      key={asset.id}
                      asset={asset}
                      selected={selectedAsset?.id === asset.id}
                      onClick={() => setSelectedAssetId(asset.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0B0D10]">
              {selectedAsset ? (
                <AssetViewer asset={selectedAsset} />
              ) : (
                <div className="flex flex-1 items-center justify-center p-6 text-center">
                  <div>
                    <FolderOpen className="mx-auto h-10 w-10 text-slate-600" />
                    <p className="mt-3 font-semibold text-white">
                      Select an asset
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Preview and download details will appear here.
                    </p>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </main>
      </section>
    </div>
  );
}

function AssetListItem({
  asset,
  selected,
  onClick,
}: {
  asset: AssetItem;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "group relative flex h-[58px] w-full min-w-0 flex-col justify-center overflow-hidden rounded-lg border px-3 py-2 pl-4 text-left transition-all",
        selected
          ? "border-cyan-500 bg-cyan-500/[0.08] ring-1 ring-cyan-500/40"
          : "border-white/10 bg-[#0B0D10] hover:border-white/20 hover:bg-[#14171d]",
      ].join(" ")}
    >
      <span
        className={[
          "absolute bottom-0 left-0 top-0 w-[3px] bg-gradient-to-b",
          assetLeftGradient(asset.type),
        ].join(" ")}
      />

      <div className="mb-1 flex items-center justify-between gap-1.5">
        <span
          className={[
            "rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            assetTypeBadge(asset.type),
          ].join(" ")}
        >
          {asset.type}
        </span>

        <MoreHorizontal className="h-3.5 w-3.5 shrink-0 text-slate-600 opacity-0 transition group-hover:opacity-100" />
      </div>

      <h3 className="truncate text-[12px] font-bold leading-none text-slate-100">
        {asset.title}
      </h3>
    </button>
  );
}

function AssetViewer({ asset }: { asset: AssetItem }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b border-white/10 bg-[#111318] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span
              className={[
                "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
                assetTypeBadge(asset.type),
              ].join(" ")}
            >
              {asset.type}
            </span>

            <h3 className="mt-3 break-words text-xl font-bold leading-snug text-white">
              {asset.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">{asset.brand}</p>
          </div>

          <button
            onClick={() => alert("Later: asset CRUD actions")}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="scroll-panel min-h-0 flex-1 overflow-y-auto p-5">
        {asset.type === "image" && (
          <div className="flex h-[calc(100vh-365px)] min-h-[660px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#07090c] p-4">
            <img
              src={asset.imageUrl}
              alt={asset.title}
              className="h-full max-h-full w-full max-w-full object-contain"
            />
          </div>
        )}

        {asset.type === "prompt" && (
          <div className="h-[calc(100vh-365px)] min-h-[660px] overflow-y-auto rounded-xl border border-white/10 bg-[#111318] p-7">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Prompt Text
              </p>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(asset.content ?? "")
                }
                className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-300 transition hover:bg-violet-500/20"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
            </div>

            <p className="whitespace-pre-wrap break-words text-[16px] leading-8 text-slate-100">
              {asset.content}
            </p>
          </div>
        )}

        {(asset.type === "pdf" || asset.type === "doc") && (
          <div className="flex h-[calc(100vh-365px)] min-h-[660px] items-center justify-center rounded-xl border border-white/10 bg-[#111318] p-6 text-center">
            <div>
              <FileText className="mx-auto h-16 w-16 text-cyan-300" />
              <p className="mt-4 text-lg font-bold text-white">
                {asset.type === "pdf" ? "PDF Document" : "Document File"}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
                This file is downloadable and can be opened externally.
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-xl border border-white/10 bg-[#111318] p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
            Description
          </p>

          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-300">
            {asset.description}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {asset.fileUrl && (
            <a
              href={asset.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2.5 text-sm font-bold text-blue-300 transition hover:bg-blue-500/20"
            >
              <ExternalLink className="h-4 w-4" />
              Open
            </a>
          )}

          {asset.fileUrl && (
            <a
              href={asset.fileUrl}
              download
              className="flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0B0D10] p-10 text-center">
      <div>
        <FolderOpen className="mx-auto h-10 w-10 text-slate-600" />
        <p className="mt-3 font-semibold text-white">{title}</p>
        <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function assetTypeBadge(type: AssetItem["type"]) {
  switch (type) {
    case "prompt":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    case "pdf":
      return "border-blue-500/20 bg-blue-500/10 text-blue-300";
    case "doc":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "image":
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function assetLeftGradient(type: AssetItem["type"]) {
  switch (type) {
    case "prompt":
      return "from-violet-400 via-violet-500 to-blue-500";
    case "pdf":
      return "from-blue-400 via-blue-500 to-cyan-500";
    case "doc":
      return "from-amber-400 via-orange-500 to-red-500";
    case "image":
      return "from-cyan-400 via-cyan-500 to-blue-500";
    default:
      return "from-slate-400 via-slate-500 to-slate-600";
  }
}