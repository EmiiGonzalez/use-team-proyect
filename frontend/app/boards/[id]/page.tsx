"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BoardDetailRedirect() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (params?.id) {
      // Cambiá esta navegación al destino real de tu tablero
      router.replace(`/dashboard?boardId=${params.id}`);
    }
  }, [params?.id, router]);

  return null;
}
