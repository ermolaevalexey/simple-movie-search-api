export interface RouteModel<T={}> {
    path: string;
    methods: Array<string>;
    handler: any;
    params?: T;
}
