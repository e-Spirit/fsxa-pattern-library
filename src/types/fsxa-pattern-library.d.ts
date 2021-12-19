import "vue-tsx-support/enable-check";
import { Module } from "vuex";
import { RootState, FSXAVuexState } from "./../store";
import {
  CreateStoreProxyOptions,
  CreateStoreRemoteOptions,
} from "./components";

export function getFSXAModule<R extends RootState>(
  options: CreateStoreProxyOptions | CreateStoreRemoteOptions,
): Module<FSXAVuexState, R>;

export {
  FSXAActions,
  FSXAGetters,
  RootState,
  FSXAAppError,
  FSXAAppState,
  FSXAVuexState,
} from "./../store";
export * from "./components";
export * from "./../constants";
