import { ContainerBuilder } from "diod";
import { Http } from "../shared/infrastructure/Http";
import { HttpFetchApi } from "../shared/infrastructure/HttpFetchApi";
import { FetchTripsUseCase } from "../slices/tripAnalysis/application/FetchTripsUseCase";
import { TripRepository } from "../slices/tripAnalysis/domain/TripRepository";
import { FilterTripsUseCase } from "../slices/tripAnalysis/application/FilterTripsUseCase";
import { ApiTripRepository } from "../slices/tripAnalysis/infrastructure/ApiTripRepository";
import { GetAverageNetMarginByProfit } from "../slices/tripAnalysis/application/GetAverageNetMarginByProfitUseCase";

const builder = new ContainerBuilder();

builder.register(Http).use(HttpFetchApi);
builder.register(TripRepository).use(ApiTripRepository).withDependencies([Http]);
builder.registerAndUse(FetchTripsUseCase).withDependencies([TripRepository]);
builder.registerAndUse(FilterTripsUseCase);
builder.registerAndUse(GetAverageNetMarginByProfit);

export const container = builder.build();
