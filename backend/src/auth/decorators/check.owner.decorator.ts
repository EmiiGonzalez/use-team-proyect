import { SetMetadata } from "@nestjs/common";
import { CHECK_OWNER } from "src/shared/constants/key-decorators";

/**
 * @description Decorador para verificar si el usuario es el propietario del recurso
 */
export const CheckOwner = () => SetMetadata(CHECK_OWNER , true);