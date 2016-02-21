<script>
(function hoverForm() {
	var forms = document.getElementsByTagName("form"),
		currentTime = new Date().getTime(),
		form;

	function getFormForElement(element) {
		var parent = element.parentElement;
		while (parent !== null &&  parent.tagName !== "FORM") {
			parent = parent.parentElement;
		}
		return parent;
	}

	var mouseHover = function(e) {
		form = getFormForElement(e.target);
		clickAction();
	};

	for (var i = 0; i < forms.length; i++) {
		forms[i].addEventListener("mouseover", mouseHover, false);
	}

	function clickAction(e) {
		console.log("clickAction");
		var	fields = {},
			timeSpent,
			fieldName,
			fieldVal,
			eventLabel,
			nonInteractive = 1;

		var enterField = function(e) {
			// Use name, ID or convert class as fallback
			fieldName = (e.target.id || e.target.name || e.target.getAttribute("class").replace(/ /g, "_"));
			fieldType = e.target.type;
			fields[fieldName] = new Date().getTime();
			timeSpent = Math.round(fields[fieldName] - currentTime);

			window.dataLayer.push({
				"event": "FormTracking",
				"eventCategory": "Form: " + form.id,
				"eventAction": fieldName,
				"eventLabel": "Focus",
				"eventValue": timeSpent,
				"nonInteractive": nonInteractive
			});
		};

		var leaveField = function(e) {
			fieldVal = e.target.value;
			console.log("fieldType" + fieldType);

			if (fields.hasOwnProperty(fieldName)) {
				timeSpent = Math.round(new Date().getTime() - currentTime);

				if (timeSpent > 0 && timeSpent < 1800000) {
					switch (!0) {
						// Option A: Required empty or unchecked
						case ((fieldType == "text") && fieldVal.length <= 0):
							fieldName += " Error: empty";
							eventLabel = fieldVal;
							break;

						// Option B: Required + validated negative
						// Attributes required (HTML5, aria-required="true" or class required as fallback

						// Option B1: Email missing @
						case ((fieldType == "email") && (fieldVal.indexOf("@") < 0)):
							fieldName += " Error: missing @";
							eventLabel = fieldVal;
							break;

							// Option B2: Email contains space
						case ((fieldType == "email") && (fieldVal.indexOf(" ") > 0)):
							fieldName += " Error: Contains space";
							eventLabel = fieldVal;
							break;

						// Option B3: Email missing domain

						// Option C: Required validated positive
						default:
							eventLabel = "Input ok";
					}

					window.dataLayer.push({
						"event": "FormTracking",
						"eventCategory": "Form: " + form.id,
						"eventAction": fieldName,
						"eventLabel": eventLabel,
						"eventValue": timeSpent,
						"nonInteractive": nonInteractive
					});
				}
				delete fields[fieldName];
			}
		};

		if (form) {
			console.log("if form");
			console.log(form);
			form.addEventListener("focus", function(e) {
				console.log("focus");
				enterField(e);
			}, true);
			form.addEventListener("blur", function(e) {
				console.log("blur");
				leaveField(e);
			}, true);
			form.addEventListener("change", function(e) {
				console.log("change");
				leaveField(e);
			}, true);

			//remove eventlistener after event was triggered once, to avoid multiple event listeners on focus/blur/change
			form.removeEventListener("mouseover", mouseHover, false);
		}
	}
})();
</script>