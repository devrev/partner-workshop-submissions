/*
 * Copyright (c) 2024 DevRev Inc. All rights reserved.

Disclaimer:
The code provided herein is intended solely for testing purposes.
Under no circumstances should it be utilized in a production environment. Use of
this code in live systems, production environments, or any situation where
reliability and stability are critical is strongly discouraged. The code is
provided as-is, without any warranties or guarantees of any kind, and the user
assumes all risks associated with its use. It is the responsibility of the user
to ensure that proper testing and validation procedures are carried out before
deploying any code into production environments.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
export class HTTPClient {
    constructor({ endpoint, token }) {
        const axiosConfig = {
            baseURL: endpoint,
            headers: {
                Authorization: token,
            },
        };
        this.instance = axios.create(Object.assign({}, axiosConfig));
    }
    post({ headers, path, body }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.instance.request({
                method: 'POST',
                headers: headers,
                data: body,
                url: path,
            });
        });
    }
}
