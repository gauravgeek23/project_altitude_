import type { Region, RegionData } from "./types";
import ladakhHimachal from "./generated/ladakh-himachal.json";
import ladakhHimachalTerrain from "./generated/ladakh-himachal-terrain.jpg";

/**
 * Every region is a generated data file plus its terrain image, both produced by
 * scripts/prepare_region.py from src/data/regions/<id>.json. To add a state, write its
 * config, run `npm run data -- <id>`, and register it here. The renderer never changes.
 */
export const REGIONS: Record<string, Region> = {
  "ladakh-himachal": { data: ladakhHimachal as unknown as RegionData, terrainUrl: ladakhHimachalTerrain },
};

export const DEFAULT_REGION = "ladakh-himachal";
