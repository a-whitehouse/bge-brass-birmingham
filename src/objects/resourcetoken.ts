import * as bge from "bge-core";

import { Resource } from "../types";

/**
 * A coal, iron, or beer token.
 */
export class ResourceToken extends bge.Token {
    private static readonly COLORS = new Map<Resource, bge.Color>([
        [Resource.Coal, bge.Color.BLACK],
        [Resource.Iron, bge.Color.parse("ff7f00")],
        [Resource.Beer, bge.Color.parse("ffff00")]
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
            sides: 4,
            scale: 0.75,
            color: ResourceToken.COLORS.get(resource)
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
        this.outlineStyle = bge.OutlineStyle.NONE;
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
