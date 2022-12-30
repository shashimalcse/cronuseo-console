export interface IResourcesResponse {
    cursor: number;
    limit: number;
    size: number;
    results: IResourcesReslut[];
    _links: ILinks;
}

export interface IResourcesReslut {
    resource_id: string;
    name: string;
    resource_key: string;
    org_id: string;
    created_at: string;
    updated_at: string;
}

export interface ILinks {
    self:string;
    next: string;
    prev:string;
}

export interface IResourceCreateRequest {
    name: string;
    resource_key: string;
}

export interface IActionsResponse {
    cursor: number;
    limit: number;
    size: number;
    results: IActionsReslut[];
    _links: ILinks;
}

export interface IActionsReslut {
    action_id: string;
    name: string;
    action_key: string;
    org_id: string;
    created_at: string;
    updated_at: string;
}

export interface IActionCreateRequest {
    name: string;
    action_key: string;
}