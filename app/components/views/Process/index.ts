import { ProcessCard } from "./ProcessCard";
import { ProcessCategoryLabel } from "./ProcessCategoryLabel";
import { ProcessMaterials } from "./ProcessMaterials";
import { ProcessStatusLabel } from "./ProcessStatusLabel";

function Process() {}

Process.Card = ProcessCard;
Process.Materials = ProcessMaterials;
Process.StatusLabel = ProcessStatusLabel;
Process.CategoryLabel = ProcessCategoryLabel;

export { Process };
