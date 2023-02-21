import * as bge from "bge-core";

import { Resource } from "../types";

/**
 * A coal, iron, or beer token.
 */
export class ResourceToken extends bge.Token {
    private static readonly _colors = new Map<Resource, bge.Color>([
        [Resource.Coal, { r: 0, g: 0, b: 0 }],
        [Resource.Iron, { r: 255, g: 127, b: 0 }],
        [Resource.Beer, { r: 255, g: 255, b: 0 }]
    ]);

    /**
     * Which resource type this token represents.
     */
    readonly resource: Resource;

    /**
     * A coal, iron, or beer token.
     * @param resource Which resource type this token represents.
     */
    constructor(resource: Resource) {
        super({
            name: Resource[resource],
            shape: bge.TokenShape.Cube,
            scale: 0.75,
            color: ResourceToken._colors.get(resource)
        });

        this.resource = resource;
    }
}

export class ResourceTokenSlot<TData = undefined> extends bge.Zone {
    private _token: ResourceToken;

    @bge.display()
    get token() {
        return this._token;
    }

    get hasToken() {
        return this.token != null;
    }

    readonly data: TData;

    constructor(data: TData) {
        super(1, 1);

        this.data = data;
        this.hideIfEmpty = true;
        this.outlineStyle = bge.OutlineStyle.None;
    }

    add(token: ResourceToken): void {
        if (this.hasToken) {
            throw new Error("Cannot add a token to a populated resource token slot");
        }

        this._token = token;
    }

    take(): ResourceToken {
        if (!this.hasToken) {
            throw new Error("Cannot take from an empty resource token slot");
        }

        const token = this.token;
        this._token = null;
        return token;
    }
}
