import React, { useState } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';

export default function ConditionalLogicBuilder({ fields, logic, onChange }) {
  const [rules, setRules] = useState(logic || []);

  const addRule = () => {
    const newRule = {
      id: Date.now().toString(),
      triggerField: '',
      condition: 'equals',
      value: '',
      action: 'show',
      targetFields: []
    };
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onChange(updatedRules);
  };

  const updateRule = (ruleId, updates) => {
    const updatedRules = rules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    setRules(updatedRules);
    onChange(updatedRules);
  };

  const deleteRule = (ruleId) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRules(updatedRules);
    onChange(updatedRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-800">Conditional Logic</h3>
        </div>
        <button
          onClick={addRule}
          className="neu-button px-3 py-2 rounded-lg text-gray-700 hover:text-gray-900 text-sm flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Rule</span>
        </button>
      </div>

      {rules.length === 0 ? (
        <div className="neu-inset p-6 rounded-lg text-center">
          <Zap className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">No conditional rules yet. Add rules to show/hide fields based on user responses.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={rule.id} className="neu-inset p-4 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Rule #{index + 1}</span>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">When field</label>
                    <select
                      value={rule.triggerField}
                      onChange={(e) => updateRule(rule.id, { triggerField: e.target.value })}
                      className="neu-input w-full px-3 py-2 text-sm text-gray-700"
                    >
                      <option value="">Select field</option>
                      {fields.map(field => (
                        <option key={field.id} value={field.id}>{field.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Condition</label>
                    <select
                      value={rule.condition}
                      onChange={(e) => updateRule(rule.id, { condition: e.target.value })}
                      className="neu-input w-full px-3 py-2 text-sm text-gray-700"
                    >
                      <option value="equals">Equals</option>
                      <option value="not_equals">Not equals</option>
                      <option value="contains">Contains</option>
                      <option value="greater_than">Greater than</option>
                      <option value="less_than">Less than</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      placeholder="Enter value"
                      className="neu-input w-full px-3 py-2 text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Then</label>
                    <select
                      value={rule.action}
                      onChange={(e) => updateRule(rule.id, { action: e.target.value })}
                      className="neu-input w-full px-3 py-2 text-sm text-gray-700"
                    >
                      <option value="show">Show</option>
                      <option value="hide">Hide</option>
                      <option value="require">Make required</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Target fields</label>
                    <select
                      multiple
                      value={rule.targetFields}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        updateRule(rule.id, { targetFields: selected });
                      }}
                      className="neu-input w-full px-3 py-2 text-sm text-gray-700"
                      size={3}
                    >
                      {fields.filter(f => f.id !== rule.triggerField).map(field => (
                        <option key={field.id} value={field.id}>{field.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}