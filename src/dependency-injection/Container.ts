import { ContainerBuilder } from "diod";
import { Http } from "../shared/infrastructure/Http";
import { HttpFetchApi } from "../shared/infrastructure/HttpFetchApi";

const builder = new ContainerBuilder();

builder.register(Http).use(HttpFetchApi);

export const container = builder.build();
