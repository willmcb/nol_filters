
$(document).ready(function(){
	var NolPageData = [];

	var NolCurrentPageData = [];

	// get table data
	$("#nol_table_body tr").each(function() {
	    var arrayOfThisRow = [];
	    var tableData = $(this).find('td');
	    if (tableData.length > 0) {
	        tableData.each(function() { 
	        	arrayOfThisRow.push($(this).text());
	        });
	        NolPageData.push(arrayOfThisRow);

	    }
	});

	// get table data
	updateCurrentPageData();

	console.log(NolPageData);

	function updateCurrentPageData(){	
		NolCurrentPageData = [];
	    $("#nol_table_body tr").each(function() {
		    var arrayOfThisRow = [];
		    var tableData = $(this).find('td');
		    if (tableData.length > 0) {
		        tableData.each(function() { 
		        	arrayOfThisRow.push($(this).text());
		        });
		        NolCurrentPageData.push(arrayOfThisRow);
		    }
		});
	}


	// -- filters

	function reverseDateString(str){
	 	var reversed = str.split("/")
	 	reversed = [reversed[2], reversed[1], reversed[0]];
	 	reversed = reversed.join("");
	 	return reversed;
	}

	// reorder by date

	function dateCompare(dateArray, index){
		dateArray.sort(function(a, b) {
			    var valueA, valueB;

			    valueA = reverseDateString(a[index]); 
			    valueB = reverseDateString(b[index]);

			    if (valueA > valueB) {
			        return -1;
			    }
			    else if (valueA < valueB) {
			        return 1;
			    }
			    return 0;
			});
	}

	function reorderByDate(nolArray, criteria){
		if(criteria === 'dateAdded'){
			dateCompare(nolArray, 2);
		} else if(criteria === 'hearing'){
			dateCompare(nolArray, 4);
		} else if(criteria === 'lastChecked'){
			dateCompare(nolArray, 6);
		} else {
			console.log('invalid date criteria in reorderByDate()')
		}
		return nolArray
	}


	function sortByHearingDays(nolArray){
		var nolArrayInner = nolArray;
		var sortedArray = [];
		nolArrayInner.sort(function(a, b) {
			    var valueA, valueB;

			    valueA = parseInt(a[5].trim()); 
			    valueB = parseInt(b[5].trim());

			    if (valueA > valueB) {
			        return -1;
			    }
			    else if (valueA < valueB) {
			        return 1;
			    }
			    return 0;
		});
		return nolArrayInner;
	}

	// filter by office
    function officeFilter(nolArray,criteria){
    	var filteredOfficeArray = nolArray.filter(function(row){
    		return row[1] === criteria
    	});
    	rebuildTable(filteredOfficeArray);
    }

	// filter by date last checked
	var dateLastCheckedSubset = [];

	// -- filters end --

	// -- rebuild table --
	function rebuildTable(nolArray){
		$('#nol_table_body').detach();

		var tableHtml = '<tbody id="nol_table_body">';

		$.each(nolArray, function(index, value){
			tableHtml += '<tr>'
			$.each(value, function(index,value2){
				tableHtml += '<td>' + value2 + '</td>';
			});
			tableHtml += '</tr>';
		});

		tableHtml += '</tbody>' 

	   $('#nol_table').append(tableHtml);

	}


	// -- event listeners 
	$('#dateAddedFilter').click(function(){
		var filteredByDateAdded = reorderByDate(NolCurrentPageData,'dateAdded');
		rebuildTable(filteredByDateAdded);
	});

	$('#officeFilter').click(function(){
		$('#nol_table_body').detach();
		officeFilter(NolCurrentPageData, 'NOT');
		updateCurrentPageData();

	});

	$('#hearingDateFilter').click(function(){
		rebuildTable(reorderByDate(NolCurrentPageData,'hearing'));		
	});

	$('#dateLastCheckedFilter').click(function(){
		rebuildTable(reorderByDate(NolCurrentPageData,'lastChecked'));
	});

	$('#daysPastHearing').click(function(){
	    $('#nol_table_body').detach();
		rebuildTable(sortByHearingDays(NolCurrentPageData));
	});

	$('#resetFilters').on('click', function(){
		rebuildTable(NolPageData)
		NolCurrentPageData = NolPageData;
	});

});


