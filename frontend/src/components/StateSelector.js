import React from 'react';

const StateSelector = ({ value, onChange }) => {
const states = [
"ANDAMAN AND NICOBAR",
"ANDHRA PRADESH",
"ARUNACHAL PRADESH",
"ASSAM",
"BIHAR",
"CHHATTISGARH",
"DN HAVELI AND DD",
"GOA",
"GUJARAT",
"HARYANA",
"HIMACHAL PRADESH",
"JAMMU AND KASHMIR",
"JHARKHAND",
"KARNATAKA",
"KERALA",
"LADAKH",
"LAKSHADWEEP",
"MADHYA PRADESH",
"MAHARASHTRA",
"MANIPUR",
"MEGHALAYA",
"MIZORAM",
"NAGALAND",
"ODISHA",
"PUDUCHERRY",
"PUNJAB",
"RAJASTHAN",
"SIKKIM",
"TAMIL NADU",
"TELANGANA",
"TRIPURA",
"UTTAR PRADESH",
"UTTARAKHAND",
"WEST BENGAL",
];

return (
<div className="field">
<label>State Name</label>
<select value={value} onChange={(e) => onChange(e.target.value)}>
<option value="">Select</option>
{states.map(s => <option key={s} value={s}>{s}</option>)}
</select>
</div>
);
};

export default StateSelector;