export class ResourceResponseDto {
  id: string;
  title: string;
  url: string;
  publishedAt: string; // Queremos enviar la fecha formateada como string
  description?: string;
}
