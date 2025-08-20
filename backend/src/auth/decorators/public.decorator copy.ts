import { SetMetadata } from "@nestjs/common";
import { PUBLIC_KEY } from "src/shared/constants/key-decorators";

/**
 * @description Decorador para marcar un endpoint como publico y no requerir autenticación
 */
export const PublicAccess = () => SetMetadata(PUBLIC_KEY , true);