angular.module('JSONFormaterApp', [])

    .controller('JSONFormaterController', ['$scope', '$window', function ($scope, $window) {
        $scope.inputText = '';
        // List of All indentations
        $scope.indentOptions = [
            { label: 'None', value: 0 },
            { label: 'One Space', value: 1 },
            { label: 'Two Spaces', value: 2 },
            { label: 'Three Spaces', value: 3 },
            { label: 'Four Spaces', value: 4 }
        ];
        //Default Indentation 
        $scope.selectedIndentOption = $scope.indentOptions[2];
        // Clear Input
        $scope.clearInput = function () {
            $scope.inputText = '';
            $window.document.getElementById('inputTextarea').focus();
        };
        $scope.$watch('inputText', formattedOutput);
        $scope.$watch('selectedIndentOption', formattedOutput);
        //Output according User's Point
        function formattedOutput() {
            try {
                var indent = $scope.selectedIndentOption.value;
                $scope.indent = indent;
                $scope.outputText = updatedJSON($scope.inputText, indent);
                $scope.outputClass = 'text-success';
            }
            catch (err) {
                $scope.outputText = err.message;
                $scope.outputClass = 'text-danger';
            }
        }

        function updatedJSON(input, indent) {
            if (input.length == 0) {
                return '';
            }
            else {
                var parsedData = JSON.parse(input);
                $scope.indent = indent;
                return JSON.stringify(parsedData, null, indent);
            }
        }

        $scope.copyToClipboard = function () {
            var copyFrom = document.createElement("textarea");
            copyFrom.textContent = $scope.outputText;
            var body = document.getElementsByTagName('body')[0];
            body.appendChild(copyFrom);
            copyFrom.select();
            document.execCommand('copy');
            body.removeChild(copyFrom);
        }

        $scope.downloadJSON = function () {
            var blob = new Blob([updatedJSON($scope.inputText, $scope.indent)], { type: "application/json;charset=utf-8;" });
            var downloadLink = angular.element('<a></a>');
            downloadLink.attr('href', window.URL.createObjectURL(blob));
            const date = new Date();
            const formattedDate = date.toLocaleString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            }).replace(/ /g, '-');
            downloadLink.attr('download', formattedDate+'.json');
            downloadLink[0].click();
        }

    }]);