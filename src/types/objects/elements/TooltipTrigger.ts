import { Controls } from "../properties/Controls";
import { Focus } from "../properties/Focus";
import { Inputs } from "../properties/Inputs";
import { Layouts } from "../properties/Layouts";
import { TooltipTriggers } from "../properties/TooltipTriggers";
import { TTS } from "../properties/TTS";

export interface TooltipTrigger extends TooltipTriggers, Controls, Layouts, Focus, Inputs, TTS { }