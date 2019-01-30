$.import("MSS_MOBILE.Functions", "Functions");
$.import("MSS_MOBILE.Constants","Constants");
var Constants = $.MSS_MOBILE.Constants;
var functions = $.MSS_MOBILE.Functions;
var objResponse;
var objResult;
var objCount = 0;
var objType;

var DATABASE = '';
var TABLE_RATE = 'ORTT';
var QUERY = 'SELECT TO_VARCHAR("RateDate",\'YYYYMMDD\') as "RateDate", "Currency", "Rate" FROM ';
var WHERE_CLAUSE = ' WHERE DAYS_BETWEEN("RateDate", CURRENT_DATE) <= 30 ';

function handleGet() {
    try{
        var mQuery = QUERY + DATABASE + '.' + TABLE_RATE + WHERE_CLAUSE;
        var mConn = $.hdb.getConnection();
        var rs = mConn.executeQuery(mQuery);
    	mConn.close();
	    
	    if (rs.length > 0)
    	{
    	    var i;
    	    var mResult = [];
    	    var mObject;
    		for(i = 0; i < rs.length ; i++)
    		{
    		    mObject= {};
    		    mObject.Fecha = rs[i].RateDate;
    		    mObject.Moneda = rs[i].Currency;
    		    mObject.Tasa = rs[i].Rate;
    		    mResult.push(mObject);
    		}
    		
    		objType = Constants.SUCCESS_OBJECT_RESPONSE;
        	objResult = functions.CreateJSONObject(100, JSON.stringify(mResult), 1);
        	objCount = mResult.length;
    	}
    }catch(e){
        objType = Constants.ERROR_MESSAGE_RESPONSE;
        objResult = functions.CreateJSONMessage(-9703000, e.message);
    }
}

// Check Content type headers and parameters
function validateInput() {
	
	try{
	   /* var contentType = $.request.contentType;
    	if ( contentType === null || contentType.startsWith("application/json") === false){
    		 objResult = functions.CreateJSONMessage($.net.http.INTERNAL_SERVER_ERROR, 
    		            "Wrong content type request use application/json");
    		 return false;
    	} */
    	
    	var idDataBase = $.request.parameters.get('dbId');
    	if(idDataBase !== undefined){
    	    DATABASE = functions.GetDataBase(idDataBase);
    	}else{
    	    objResult = functions.CreateJSONMessage("-400", "No se ha recibido el parámetro dbId.");
    	    return false;
    	}    
	}catch(e){
	    objResult = functions.CreateJSONMessage("-401", "Failed to execute action: validateInput() >  " + e.toString());
	    return false;
	}
	
	return true;
}

// Request process 
function processRequest(){
	if (validateInput()){
		try {
		    switch ( $.request.method ) {
		        case $.net.http.GET:
		            handleGet();
		            break;
		        default:
		            objType = Constants.ERROR_MESSAGE_RESPONSE;
                    objResult = functions.CreateJSONMessage($.net.http.METHOD_NOT_ALLOWED, "Wrong request method");
		            break;
		    }	    
		} catch (e) {
		    objType = Constants.ERROR_MESSAGE_RESPONSE;
		    objResult = functions.CreateJSONMessage($.net.http.INTERNAL_SERVER_ERROR, "Can't execute action.");
		}finally{
		    objResponse = functions.CreateResponse(objType, objResult, objCount);
		    functions.DisplayJSON(objResponse, objType);
		} 
	}else{
	    objType = Constants.ERROR_MESSAGE_RESPONSE;
	    objResponse = functions.CreateResponse(objType, objResult, objCount);
		functions.DisplayJSON(objResponse, objType);
	}
}

// Call request processing  
processRequest();