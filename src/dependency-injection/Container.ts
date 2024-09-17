import { ContainerBuilder } from "diod";
import { Http } from "../shared/infrastructure/Http";
import { HttpFetchApi } from "../shared/infrastructure/HttpFetchApi";
import { FetchTripsUseCase } from "../slices/tripAnalysis/application/FetchTripsUseCase";
import { TripRepository } from "../slices/tripAnalysis/domain/TripRepository";

const builder = new ContainerBuilder();

builder.register(Http).use(HttpFetchApi);
builder.registerAndUse(FetchTripsUseCase).withDependencies([TripRepository]);

export const container = builder.build();
