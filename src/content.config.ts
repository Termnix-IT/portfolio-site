import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({
  label: z.string(),
  href: z.url(),
});

// 作成ツール一覧（toolbox.html）。1ツール1ファイルで、本文は説明の段落
const tools = defineCollection({
  loader: glob({ base: './src/content/tools', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    // 旧ページの #tool-N へのリンクを保つためのアンカー
    anchor: z.string(),
    category: z.string(),
    status: z.string().default('公開中'),
    // 一覧のカードとホームの「代表作」に出す短い説明
    summary: z.string(),
    tags: z.array(z.string()),
    repo: z.url(),
    // GitHub Releases のタグ。リンク先は repo から組み立てる
    release: z.string().optional(),
    // リリースがない場合などに「Releaseを見る」の代わりに出すリンク
    secondaryLink: link.optional(),
    // ホームの「代表作」に載せる場合の並び順
    featured: z.number().optional(),
  }),
});

const publication = z.object({
  label: z.string(),
  description: z.string(),
  status: z.string(),
});

// 構築プロジェクト（portfolio.html）
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      anchor: z.string(),
      category: z.string(),
      status: z.string(),
      // ホームの「代表作」に載せるときの短い説明
      summary: z.string().optional(),
      tags: z.array(z.string()),
      publications: z.array(publication),
      diagram: z.object({ image: image(), alt: z.string() }).optional(),
      featured: z.number().optional(),
    }),
});

// 構成図ギャラリー（diagram.html）
const diagrams = defineCollection({
  loader: glob({ base: './src/content/diagrams', pattern: '*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      anchor: z.string(),
      category: z.string(),
      status: z.string(),
      date: z.string(),
      tags: z.array(z.string()),
      image: image(),
      alt: z.string(),
    }),
});

// 現職・経歴・スキル・資格など、複数ページで使うプロフィール情報。配列の順がそのまま表示順になる
const profile = defineCollection({
  loader: file('./src/data/profile.yaml'),
  schema: z.object({
    role: z.string(),
    status: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        tone: z.enum(['live', 'neutral', 'progress']),
      }),
    ),
    strengths: z.array(
      z.object({ index: z.string(), title: z.string(), body: z.string() }),
    ),
    career: z.array(
      z.object({
        period: z.string(),
        current: z.boolean().default(false),
        title: z.string(),
        body: z.string(),
        tags: z.array(z.string()),
      }),
    ),
    skills: z.array(
      z.object({
        title: z.string(),
        category: z.string(),
        body: z.string(),
        tags: z.array(z.string()),
      }),
    ),
    certifications: z.array(
      z.object({ name: z.string(), state: z.enum(['acquired', 'learning']) }),
    ),
  }),
});

export const collections = { tools, projects, diagrams, profile };
