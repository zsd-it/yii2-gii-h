<?php

use yii\helpers\Inflector;
use yii\helpers\StringHelper;

/* @var $this yii\web\View */
/* @var $generator yii\gii\generators\crud\Generator */

/* @var $model \yii\db\ActiveRecord */
$model = new $generator->modelClass();
$safeAttributes = $model->safeAttributes();
if (empty($safeAttributes)) {
    $safeAttributes = $model->attributes();
}
/**
 * @var Ambigous <boolean, \yii\db\TableSchema> $tableSchema
 */
$tableSchema = $generator->getTableSchema();
echo "<?php\n";
?>

use yii\helpers\Html;
use yii\widgets\ActiveForm;

/* @var $this yii\web\View */
/* @var $model <?= ltrim($generator->modelClass, '\\') ?> */
/* @var $form yii\widgets\ActiveForm */
?>

<div class="<?= Inflector::camel2id(StringHelper::basename($generator->modelClass)) ?>-form">

    <?= "<?php " ?>$form = ActiveForm::begin([
    	'options' => ['class' => 'form-horizontal'],
    	'fieldConfig' => [
            'options' => ['class' => 'form-group'],
            'template' => "{label}\n<div class=\"col-sm-8\">{input}\n<span class=\"help-block m-b-none\">{error}</span></div>",
            'labelOptions' => ['class' => 'col-sm-2 control-label'],
    	]
    ]); ?>

<?php foreach ($generator->getColumnNames() as $attribute) {
    if (!in_array($attribute, $safeAttributes) || in_array($attribute, $generator->getIgnoreAttribute())) {
        continue;
    }
    $comments = $tableSchema->columns[$attribute]->comment;
    if ($comments) {
        $arr = explode($generator->dilimiter, $comments);
        $type = $arr[1] ?? false;
        if ($type) {
            switch ($type) {
                case in_array($type, $generator->imageFlag);
                $str = "    <?= \$form->field(\$model, '$attribute')->widget(\zh\qiniu\QiniuFileInput::className(),[
        'qlConfig' => \Yii::\$app->params['ql'],
        'uploadUrl' => 'https://upload.qiniup.com',
        'clientOptions' => [
            'max'=>1
        ]
    ]) ?>\n\n";
                break;
            }
            if (isset($str)) {
                echo $str;
                continue;
            }
        }
    }
    echo "    <?= " . $generator->generateActiveField($attribute) . " ?>\n\n";
} ?>
    <div class="form-group">
    	<div class="col-sm-4 col-sm-offset-2">
        	<?= "<?= " ?>Html::submitButton($model->isNewRecord ? <?= $generator->generateString('创建') ?> : <?= $generator->generateString('更新') ?>, ['class' => $model->isNewRecord ? 'btn btn-success' : 'btn btn-primary']) ?>
    	</div>
    </div>

    <?= "<?php " ?>ActiveForm::end(); ?>

</div>
