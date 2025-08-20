import { SetMetadata } from "@nestjs/common";
import { PASS_CHECK } from "src/shared/constants/key-decorators";

/**
 * @description Decorador para marcar un endpoint como publico y comprobar el acceso
 */
export const PassCheck = (state: boolean) => SetMetadata(PASS_CHECK, state);