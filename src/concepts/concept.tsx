import { createContext, useContext } from 'react';
import { useParams, Link, type LinkProps } from 'react-router';

export type ConceptId = 'a' | 'b' | 'c';
export const CONCEPTS: Record<ConceptId, { id: ConceptId; name: string; short: string; tagline: string }> = {
  a: { id: 'a', name: 'A. 취향 편집숍', short: '편집숍', tagline: '구경하다가 더 알고 싶은, 감각 있는 취향 상점' },
  b: { id: 'b', name: 'B. 컬렉터 아카이브', short: '아카이브', tagline: '찾기 쉽고 오래 들여다볼 수 있는 도감' },
  c: { id: 'c', name: 'C. 플레이풀 쇼룸', short: '쇼룸', tagline: '오들리와 상품이 하나의 장면을 이루는 브랜드 공간' },
};
export const isConcept = (v: unknown): v is ConceptId => v === 'a' || v === 'b' || v === 'c';

const Ctx = createContext<ConceptId>('a');
export const ConceptProvider = Ctx.Provider;
export const useConcept = () => useContext(Ctx);
export function useConceptFromRoute(): ConceptId {
  const { concept } = useParams();
  return isConcept(concept) ? concept : 'a';
}
/** 방향별 경로 생성: cpath('/shop') → /concepts/a/shop */
export function useCPath() {
  const c = useConcept();
  return (path: string) => `/concepts/${c}${path === '/' ? '' : path}`;
}
/** 현재 방향 안에서 이동하는 Link */
export function CLink({ to, ...rest }: Omit<LinkProps, 'to'> & { to: string }) {
  const cpath = useCPath();
  return <Link to={cpath(to)} {...rest} />;
}
