import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/supabase/adminSession';
import { newEntityId } from '@/lib/supabase/queries';
import { parseStorageModule } from '@/lib/storageUpload';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const type = file.type || 'application/octet-stream';
    if (!ALLOWED.has(type)) {
      return NextResponse.json({ error: 'Unsupported image type' }, { status: 400 });
    }

    const ext =
      type === 'image/png'
        ? 'png'
        : type === 'image/webp'
          ? 'webp'
          : type === 'image/gif'
            ? 'gif'
            : 'jpg';

    const module = parseStorageModule(form.get('module'));
    const path = `${module}/${newEntityId()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await auth.admin.storage.from('media').upload(path, buffer, {
      contentType: type,
      upsert: false,
    });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = auth.admin.storage.from('media').getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, path });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
