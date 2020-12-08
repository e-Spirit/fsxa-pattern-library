import "vue-tsx-support/enable-check";

import { Module } from "vuex";
import { RootState, FSXAVuexState, FSXAModuleParams } from "./../store";
import { FSXAContentMode } from "fsxa-api";

export function getFSXAModule<R extends RootState>(
  mode: FSXAContentMode,
  params: FSXAModuleParams,
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
