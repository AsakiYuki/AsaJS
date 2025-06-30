import { Configs } from "../compilers/Config";
import { Identifier } from "../types/components/Identifier";
import { AnimationTypes } from "../types/enums/AnimTypes";
import { AnimationInterface } from "../types/objects/Animation";
import { AnimationKeyFrame } from "./AnimationKeyFrame";
import { Class } from "./Class";
import { Random } from "./Random";

export class Animation extends Class {
    private keyFrames: Array<string> = [];
    private buildKey: number = 0;
    private config = Configs.getConfig();

    static register(animation: AnimationInterface, identifier?: Identifier): Animation {
        return new Animation(animation, identifier);
    }

    constructor(animation: AnimationInterface, private identifier?: Identifier) {
        super()
        if (!(identifier && !this.config.compiler.UI.obfuscateName))
            identifier = {
                name: Random.getAnimationName(),
                namespace: Random.getNamespace(),
            };
        else {
            if (!identifier.name) identifier.name = Random.getAnimationName();
            if (!identifier.namespace) identifier.namespace = Random.getAnimationName();
        }

        this.buildAnimation(animation, identifier);
    }

    getKeyIndex(index: number): string {
        let i = index < 0 ? 0 : Math.min(index, this.keyFrames.length);
        return `@${this.keyFrames[index]}`;
    }

    private buildAnimation(
        { from, keyFrames, loop, type, durationPerKeyFrame = 1, smartCycle, defaultEase }: AnimationInterface,
        identifier: Identifier
    ) {
        const prefix = keyFrames.length - 1;

        if ((smartCycle === undefined || smartCycle) && loop) {
            if (typeof keyFrames[prefix] == "number") keyFrames[prefix] = {
                duration: keyFrames[prefix],
                to: from,
            }
            else if (JSON.stringify((keyFrames[prefix] as any).to) != JSON.stringify(from)) {
                keyFrames.push({
                    to: (keyFrames[0] as any).from ?? from,
                    duration: durationPerKeyFrame,
                    easing: defaultEase
                });
            }
        }

        const frameLength = keyFrames.length - 1;

        keyFrames.forEach((keyFrame, index) => {
            this.keyFrames.push(`${identifier.namespace}.${identifier.name}`);
            const currentIdentifier = identifier;

            let next;

            if (index === frameLength) {
                if (loop) next = this.getKeyIndex(0);
            } else {
                identifier = this.generateIdentifier();
                next = this.getFrameKeyByIdentifier(identifier);
            }

            if (typeof keyFrame == "number") {
                new AnimationKeyFrame(
                    <any>{
                        next,
                        anim_type: AnimationTypes.Wait,
                        duration: keyFrame,
                    },
                    currentIdentifier
                );
            } else {
                new AnimationKeyFrame(
                    <any>{
                        next,
                        anim_type: type,
                        from,
                        duration: (<any>keyFrame).duration ?? durationPerKeyFrame,
                        easing: defaultEase,
                        ...(<any>keyFrame),
                    },
                    currentIdentifier
                );
            }

            if (typeof keyFrame === "object") from = (<any>keyFrame).to;
        });
    }

    private generateIdentifier() {
        if (this.config.compiler.UI.obfuscateName) return {
            name: Random.getAnimationName(),
            namespace: Random.getNamespace(),
        }
        else return {
            name: this.identifier?.name ? `${this.identifier.name}-f${this.buildKey++}` : Random.getAnimationName(),
            namespace: this.identifier?.namespace || Random.getNamespace(),
        };
    }

    private getFrameKeyByIdentifier(identifier: Identifier) {
        return `@${identifier.namespace}.${identifier.name}`;
    }
}
