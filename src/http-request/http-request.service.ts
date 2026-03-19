import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export interface HttpRequestAuth {
    authKey: string;
    authValue: string;
}

export interface HttpOptions {
    log?: boolean;
    headers?: Record<string, any>;
    data?: Record<string, any>;
}

@Injectable()
export class HttpRequestService {
    constructor(private readonly httpService: HttpService) {}
    async get(host: string, httpOptions?: HttpOptions) {
        try {
            // const headers = this.authHeaderSet(httpOptions?.httpRequestAuth);
            const queryString = this.processQueryString(httpOptions?.data);
            const domain = host + (queryString == null ? "" : `?${queryString}`);
            if (httpOptions?.log) console.log(domain);
            const result = await firstValueFrom(this.httpService.get(host, { headers: httpOptions.headers }));
            return result;
        } catch (e) {
            if (httpOptions?.log) console.log(e);
            throw new InternalServerErrorException(String(JSON.stringify(e?.response?.data) || e?.response?.status));
        }
    }

    async post(host: string, httpOptions?: HttpOptions) {
        try {
            // const headers = this.authHeaderSet(httpOptions?.httpRequestAuth);
            // if (httpOptions?.log) console.log(host, httpOptions?.data);
            const result = await firstValueFrom(
                this.httpService.post(host, httpOptions?.data, { headers: httpOptions.headers }),
            );
            return result;
        } catch (e) {
            if (httpOptions?.log) console.log(e);
            throw new InternalServerErrorException(String(JSON.stringify(e?.response?.data) || e?.response?.status));
        }
    }

    async delete(host: string, httpOptions?: HttpOptions) {
        try {
            const result = await firstValueFrom(
                this.httpService.delete(host, { data: httpOptions?.data, headers: httpOptions.headers }),
            );
            return result;
        } catch (e) {
            if (httpOptions?.log) console.log(e);
            throw new InternalServerErrorException(String(JSON.stringify(e?.response?.data) || e?.response?.status));
        }
    }

    // async delete(host: string, httpOptions?: HttpOptions) {
    //     try {
    //         const headers = this.authHeaderSet(httpOptions?.httpRequestAuth);
    //         if (httpOptions?.log) console.log(host, httpOptions?.data);
    //         const result = await firstValueFrom(this.httpService.delete(host, { headers }));
    //         return result;
    //     } catch (e) {
    //         if (httpOptions?.log) console.log(e);
    //         throw new InternalServerErrorException(String(JSON.stringify(e?.response?.data) || e?.response?.status));
    //     }
    // }

    private authHeaderSet(httpRequestAuth: HttpRequestAuth) {
        const headers = {};
        if (httpRequestAuth != null) {
            headers[httpRequestAuth.authKey] = httpRequestAuth.authValue;
        }
        return headers;
    }

    private processQueryString(querys: Record<string, any>) {
        let queryString = null;
        for (const query in querys) {
            const value = querys[query];
            const data = `${query}=${value}`;
            queryString = queryString == null ? `${data}` : `${queryString}&${data}`;
        }
        return queryString;
    }
}
