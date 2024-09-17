import { ContainerBuilder } from "diod";
import { Http } from "../shared/infrastructure/Http";
import { HttpFetchApi } from "../shared/infrastructure/HttpFetchApi";
import { FetchTripsUseCase } from "../slices/tripAnalysis/application/FetchTripsUseCase";
import { TripRepository } from "../slices/tripAnalysis/domain/TripRepository";
import { FilterTripsUseCase } from "../slices/tripAnalysis/application/FilterTripsUseCase";

const builder = new ContainerBuilder();

builder.register(Http).use(HttpFetchApi);
builder.registerAndUse(FetchTripsUseCase).withDependencies([TripRepository]);
builder.registerAndUse(FilterTripsUseCase);

export const container = builder.build();
