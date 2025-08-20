"use client";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/interfaces/api/apiResponseInterface";
import { AxiosError } from "axios";
import {
  AssignMemberForm,
  BoardRole,
} from "@/types/board/members/createAsingMembersForm";
import { useAssignMember } from "@/hooks/api/boardmember/useAssignMember";
import { useUsers } from "@/hooks/api/user/useUsers";
import {
  UserPlus,
  Mail,
  Search,
  Users,
  Crown,
  Edit,
  Eye,
  Loader,
  User,
  CheckCircle,
} from "lucide-react";
import { useBoardMemberAssignStore } from "@/store/boards/boardmember/useColumnStore";

const roleOptions = [
  {
    value: BoardRole.VIEWER,
    label: "Visualizador",
    description: "Solo puede ver el contenido",
    icon: Eye,
    color: "text-gray-600",
  },
  {
    value: BoardRole.EDITOR,
    label: "Editor",
    description: "Puede editar y crear contenido",
    icon: Edit,
    color: "text-blue-600",
  },
  {
    value: BoardRole.OWNER,
    label: "Propietario",
    description: "Control total del tablero",
    icon: Crown,
    color: "text-yellow-600",
  },
];

export const AssignMemberDialog = () => {
  const { isOpenModalAssign, setIsOpenModalAssign, idBoard } =
    useBoardMemberAssignStore();

  const [emailSearch, setEmailSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    email: string;
  } | null>(null);

  const { mutateAsync: assignMember, isPending: assignLoading } =
    useAssignMember();
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers(emailSearch);

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<AssignMemberForm>({
    defaultValues: {
      boardId: idBoard || "",
      userId: "",
      role: BoardRole.VIEWER,
    },
  });

  useEffect(() => {
    if (idBoard) {
      setValue("boardId", idBoard);
    }
  }, [idBoard, setValue]);

  useEffect(() => {
    if (selectedUser) {
      setValue("userId", selectedUser.id);
    }
  }, [selectedUser, setValue]);

  const handleClose = () => {
    setIsOpenModalAssign(false);
    reset();
    setEmailSearch("");
    setSelectedUser(null);
  };

  const onSubmit = async (data: AssignMemberForm): Promise<void> => {
    if (!selectedUser) {
      toast.error("Debe seleccionar un usuario");
      return;
    }

    await assignMember(data, {
      onSuccess: () => {
        toast.success("Miembro asignado exitosamente");
        handleClose();
      },
      onError: (error: AxiosError<ApiErrorResponse>) => {
        toast.error(error.response?.data.message || "Error al asignar miembro");
      },
    });
  };

  const handleUserSelect = (user: { id: string; email: string }) => {
    setSelectedUser(user);
    setEmailSearch(user.email);
  };

  return (
    <Dialog open={isOpenModalAssign} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Asignar miembro al tablero
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Búsqueda de usuario por email */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Buscar usuario por email
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="usuario@ejemplo.com"
                value={emailSearch}
                onChange={(e) => {
                  setEmailSearch(e.target.value);
                  setSelectedUser(null);
                }}
                autoFocus
              />
            </div>
          </div>

          {/* Lista de usuarios encontrados */}
          {emailSearch && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Usuarios encontrados
              </label>
              <div className="border rounded-lg max-h-40 overflow-y-auto">
                {usersLoading ? (
                  <div className="p-4 text-center">
                    <Loader className="h-4 w-4 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Buscando usuarios...
                    </p>
                  </div>
                ) : usersError ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-red-500">
                      Error al buscar usuarios
                    </p>
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="divide-y">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedUser?.id === user.id
                            ? "bg-blue-50 border-blue-200"
                            : ""
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {selectedUser?.id === user.id ? (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            ) : (
                              <User className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-gray-500">
                      No se encontraron usuarios
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selector de rol */}
          {selectedUser && (
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Rol del miembro
              </label>
              <Controller
                name="role"
                control={control}
                rules={{ required: "El rol es requerido" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`${
                        errors.role ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-start gap-3 py-1">
                              <Icon
                                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${option.color}`}
                              />
                              <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="text-xs text-gray-500">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>
          )}

          {/* Usuario seleccionado */}
          {selectedUser && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Usuario seleccionado:
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-1">{selectedUser.email}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={assignLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={!selectedUser || !isValid || assignLoading}
            className="cursor-pointer"
          >
            {assignLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Asignar miembro
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
