import { Modify } from "../../components/Modify";
import { UI } from "../../components/UI";

export type UIChildNameCallback = (arg: UI<any> | Modify, name: string) => void;
