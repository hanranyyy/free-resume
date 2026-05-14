"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 12 15 15" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" aria-hidden="true">
      <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-8 py-4 md:py-5">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="text-xl md:text-2xl font-bold text-blue-600 tracking-wider">Fre简历</div>
            <div className="hidden md:flex gap-6 text-[15px] font-medium text-gray-600">
              <span className="text-blue-600 cursor-pointer">首页</span>
              <Link href="/templates" className="hover:text-blue-600 cursor-pointer transition-colors">模板中心</Link>
              <Link href="/me" className="hover:text-blue-600 cursor-pointer transition-colors">我的简历</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-[14px] text-gray-500 hover:text-gray-800 font-medium">登录</button>
            <button className="px-5 py-2 bg-blue-600 text-white text-[14px] font-medium rounded-full hover:bg-blue-700 transition-colors">
              免费注册
            </button>
          </div>
          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            aria-label="切换菜单"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
        {/* Mobile menu panel */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <div className="flex flex-col gap-3 text-[15px] font-medium text-gray-700">
              <Link href="/" className="text-blue-600">首页</Link>
              <Link href="/templates">模板中心</Link>
              <Link href="/me">我的简历</Link>
            </div>
            <div className="flex gap-3 pt-3 border-t border-gray-100">
              <button className="flex-1 py-2 text-[14px] text-gray-600 border border-gray-200 rounded-full">登录</button>
              <button className="flex-1 py-2 bg-blue-600 text-white text-[14px] font-medium rounded-full">免费注册</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 px-4 sm:px-8 lg:px-20 py-14 md:py-20 lg:py-24">
          <div className="w-full lg:max-w-[500px] text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-4 md:mb-6">
              专业简历生成，
              <br className="hidden sm:block" />
              让求职更进一步
            </h1>
            <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-10 leading-relaxed">
              提供所见即所得的简历编辑器、海量专业模板与一键导出功能。无论是应届生还是职场达人，都能轻松打造令人脱颖而出的简历。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href="/templates"
                className="px-6 md:px-8 py-3 md:py-3.5 bg-blue-600 text-white rounded-lg text-base md:text-lg font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-center"
              >
                立即制作简历
              </Link>
              <Link
                href="/templates"
                className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-gray-700 rounded-lg text-base md:text-lg font-medium border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all text-center"
              >
                浏览模板
              </Link>
            </div>
          </div>
          <div className="relative w-full max-w-[600px] aspect-[3/2]">
            <Image
              src="https://l-api.jd.com/relay-aigc/design/image/prompt/A clean and modern resume editor interface design showing real-time preview on the right and editing panels on the left with blue accent colors, highly professional UI mockup?width=800&height=536"
              alt="编辑器预览"
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover rounded-2xl shadow-2xl"
              unoptimized
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 py-14 md:py-20 lg:py-24">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">强大功能，助你高效求职</h2>
            <p className="text-gray-500 text-sm md:text-[15px]">涵盖简历制作的每个环节，打造极致体验</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-gray-50/50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-5 md:mb-6">
                <EditIcon />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">实时预览编辑器</h3>
              <p className="text-gray-500 text-sm md:text-[14px] leading-relaxed">
                左侧编辑，右侧实时预览。支持拖拽排版、富文本与 Markdown 切换，轻松掌控简历布局。
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-gray-50/50">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-5 md:mb-6">
                <ExportIcon />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">多格式高质量导出</h3>
              <p className="text-gray-500 text-sm md:text-[14px] leading-relaxed">
                一键导出高清 PDF 或 Word 格式，完美适配 A4 纸张排版，确保打印与投递效果一致。
              </p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-gray-50/50">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-5 md:mb-6">
                <CloudIcon />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">云端自动保存</h3>
              <p className="text-gray-500 text-sm md:text-[14px] leading-relaxed">
                编辑过程实时云端保存，告别数据丢失焦虑。支持历史版本回溯，随时找回最佳状态。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="bg-gray-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 py-14 md:py-20 lg:py-24">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">精选热门模板</h2>
              <p className="text-gray-500 text-sm md:text-[15px]">针对不同行业和岗位精心打磨，一键套用</p>
            </div>
            <button className="self-start sm:self-auto text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              查看全部 <ArrowRightIcon />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group cursor-pointer">
                <div className="aspect-[1/1.4] rounded-lg overflow-hidden bg-white shadow-sm group-hover:shadow-xl transition-all relative">
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-[14px] font-medium">
                      使用模板
                    </button>
                  </div>
                  <Image
                    src={`https://l-api.jd.com/relay-aigc/design/image/prompt/A highly professional A4 size resume template design preview clean minimalist modern UI style white background?width=512&height=720&seed=${item}`}
                    alt="模板封面"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="mt-4 text-center">
                  <h4 className="font-semibold text-gray-800">
                    {["互联网产品经理", "通用应届生", "高级开发工程师"][item - 1]}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-20 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-xl md:text-2xl font-bold text-white mb-2">ResuMaker</div>
              <p className="text-[14px]">让每一份简历都能发光</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 text-[14px]">
              <a href="#" className="hover:text-white transition-colors">关于我们</a>
              <a href="#" className="hover:text-white transition-colors">意见反馈</a>
              <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            </div>
          </div>
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-800 text-center text-[12px]">
            © 2026 ResuMaker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}