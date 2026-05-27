import React from 'react';

const SubmissionResult = () => {
  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* 1. Status Text */}
      <p className="text-sm font-medium">
        Submission result: <span className="text-[#22C55E] font-bold">Correct answer</span>
      </p>

      {/* 2. Main Result Box */}
      <div className="border-2 border-[#22C55E] rounded-2xl py-6 px-4 bg-white shadow-sm space-y-6">
        {/* Test Case Detail */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700 block mb-1">Test input</label>
            <div className="w-full border border-slate-200 rounded-lg p-3 bg-gray-50 text-slate-600 font-mono text-sm">
              nums = [1, 2, 3, 3]
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Your output</label>
              <div className="w-full border border-slate-200 rounded-lg p-3 bg-gray-50 text-[#22C55E] font-mono text-sm font-bold">
                true
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-1">Expected output</label>
              <div className="w-full border border-slate-200 rounded-lg p-3 bg-gray-50 text-[#22C55E] font-mono text-sm font-bold">
                true
              </div>
            </div>
          </div>

          <button className="bg-gray-200 text-slate-700 px-4 py-1.5 rounded-md text-sm font-bold hover:bg-gray-300 transition-colors">
            show different
          </button>
        </div>

        {/* Phân tích sâu (Analysis Section) */}
        <div className="grid grid-cols-2 gap-10 pt-4 border-t border-gray-100">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Clean Code:</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adhere to good naming conventions and ensure clear and coherent function structures.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Refactoring:</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                List Comprehension can be used as an alternative to loops.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <select className="bg-gray-100 border-none text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer mb-2">
              <option>Analyze further</option>
            </select>
            <p className="text-xs text-slate-600">Time Complexity: $O(n \log n)$</p>
            <p className="text-xs text-slate-600">Space Complexity: $O(n)$</p>
            <p className="text-[10px] text-slate-400 italic mt-2 leading-tight">
              Use memory efficiently, however,
              <br /> unnecessary temporary variables can be reduced.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Finish Button */}
      <div className="flex justify-center mt-8">
        <button className="bg-[#22C55E] hover:bg-[#16a34a] text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md">
          Finish lesson
        </button>
      </div>
    </div>
  );
};

export default SubmissionResult;
