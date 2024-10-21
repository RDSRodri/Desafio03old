function countByKey(data, key) {
  return data.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

function calculateTotalsByKey(data, key) {
  return data.reduce((acc, item) => {
    if (!acc[item[key]]) {
      acc[item[key]] = {
        totalProduced: 0,
        totalLiquid: 0,
        totalReceived: 0,
        totalNotReceived: 0,
      };
    }
    acc[item[key]].totalProduced += item.price || 0;
    acc[item[key]].totalLiquid += item.liquid_price || 0;
    acc[item[key]].totalReceived += item.received_value || 0;
    acc[item[key]].totalNotReceived +=
      (item.liquid_price || 0) - (item.received_value || 0);
    return acc;
  }, {});
}

function groupByDate(data, format) {
  return data.reduce((acc, item) => {
    const date = new Date(item.created_at);
    let key;
    if (format === "day") {
      key = date.toISOString().split("T")[0];
    } else if (format === "month") {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    } else if (format === "year") {
      key = `${date.getFullYear()}`;
    }
    if (!acc[key]) {
      acc[key] = {
        totalProduced: 0,
        totalLiquid: 0,
        totalReceived: 0,
        totalNotReceived: 0,
      };
    }
    acc[key].totalProduced += item.price || 0;
    acc[key].totalLiquid += item.liquid_price || 0;
    acc[key].totalReceived += item.received_value || 0;
    acc[key].totalNotReceived +=
      (item.liquid_price || 0) - (item.received_value || 0);
    return acc;
  }, {});
}

fetch("dados.json")
  .then((response) => response.json())
  .then((data) => {
    const totalsByProcedureId = calculateTotalsByKey(data, "procedure_id");
    const totalsByTissType = calculateTotalsByKey(data, "tiss_type");
    const groupedByAttendanceId = countByKey(data, "attendance_id");
    const groupedByFinanceId = countByKey(data, "finance_id");
    const totalsByDay = groupByDate(data, "day");
    const totalsByMonth = groupByDate(data, "month");
    const totalsByYear = groupByDate(data, "year");

    document.getElementById("totalsByProcedureId").textContent = JSON.stringify(
      totalsByProcedureId,
      null,
      2
    );
    document.getElementById("totalsByTissType").textContent = JSON.stringify(
      totalsByTissType,
      null,
      2
    );
    document.getElementById("groupedByAttendanceId").textContent =
      JSON.stringify(groupedByAttendanceId, null, 2);

    document.getElementById("groupedByFinanceId").textContent = JSON.stringify(
      groupedByFinanceId,
      null,
      2
    );

    document.getElementById("totalsByMonth").textContent = JSON.stringify(
      totalsByMonth,
      null,
      2
    );
    document.getElementById("totalsByYear").textContent = JSON.stringify(
      totalsByYear,
      null,
      2
    );
  })
  .catch((error) => console.error("Erro ao carregar o arquivo JSON:", error));
