﻿var __spinner;
var __urlReports, __urlDashboards, __urlTiles;

$(document).ajaxStart(function () {
    if (Spinner) {
        __spinner = new Spinner().spin();
        document.getElementById("spinholder").appendChild(__spinner.el);
    }
});

$(document).ajaxComplete(function () {
    if (__spinner) __spinner.stop();
});

function _getReports() {
    var sel = $("select#ReportGuid");
    sel.find("option:gt(0)").remove();
    $.ajax({
        type: "POST",
        url: __urlReports,
        data: { accountId: $('#AccountId').val() },
        datatype: "json",
        success: function (payload) {
            if (payload.success) {
                $(payload.data).each(function (i, p) {
                    var selected = (p.Value != "" && $("input#oldReportGuid").val() == p.Value) ? ' selected=""' : "";
                    sel.append('<option value="' + p.Value + '" data-url="' + p.Url + '"' + selected + '>' + p.Text + '</option>');
                    if (selected != "") {
                        $("input#Url").val(p.Url);
                        $("input#oldReportGuid").val("");
                        $("input#submit").show();
                    }
                });
                $(".report").show();
            } else {
                alert(payload.data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function _getDashboards() {
    var sel = $("select#DashboardGuid");
    sel.find("option:gt(0)").remove();
    $.ajax({
        type: "POST",
        url: __urlDashboards,
        data: { accountId: $('#AccountId').val() },
        datatype: "json",
        success: function (payload) {
            if (payload.success) {
                $(payload.data).each(function (i, p) {
                    var selected = (p.Value != "" && $("input#oldDashboardGuid").val() == p.Value) ? ' selected=""' : "";
                    sel.append('<option value="' + p.Value + '"' + selected + '>' + p.Text + '</option>');
                    if (selected !== "")
                        _getTiles();
                });
                $(".dashboard").show();
                $("input#oldDashboardGuid").val("");
            } else {
                alert(payload.data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

function _getTiles() {
    var sel = $("select#TileGuid");
    sel.find("option:gt(0)").remove();
    $.ajax({
        type: "POST",
        url: __urlTiles,
        data: { accountId: $('#AccountId').val(), dashboard: $("select#DashboardGuid").val() },
        datatype: "json",
        success: function (payload) {
            if (payload.success) {
                $(payload.data).each(function (i, p) {
                    var selected = (p.Value != "" && $("input#oldTileGuid").val() == p.Value) ? ' selected=""' : "";
                    sel.append('<option value="' + p.Value + '" data-url="' + p.Url + '"' + selected + '>' + p.Text + '</option>');
                    if (selected != "") {
                        $("input#Url").val(p.Url);
                        $("input#oldTileGuid").val("");
                        $("input#submit").show();
                    }
                });
                $(".tile").show();
            } else {
                alert(payload.data);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(errorThrown);
        }
    });
}

$(document).ready(function () {

    $("select#DashboardGuid").change(function () {
        if ($(this).val() != "") {
            _getTiles();
        }
    });

    $("select#ReportGuid, select#TileGuid").change(function () {
        if ($(this).val() != "") {
            var opt = $('option:selected', this);
            if ($("input#Url").val(opt.attr('data-url')).val() != "") {
                var n = $("input#Name");
                if (n.val() == "")
                    n.val(opt.text());
                $("input#submit").show();
            }
        }
    });

    $("select#Type").change(function () {
        $(".report").hide();
        $(".dashboard").hide();
        $(".tile").hide();
        $("input#submit").hide();

        if ($(this).val() == "0") {
            _getReports();
        } else if ($(this).val() == "1") {
            _getDashboards();
        }
    }).change();

});
